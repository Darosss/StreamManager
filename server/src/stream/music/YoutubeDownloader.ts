import { type WriteStream } from "node:fs";
import { Constants, Innertube, IPlayerResponse, Platform, Types, UniversalCache, YTNodes } from "youtubei.js";
import { ReloadPlaybackContext } from "googlevideo/protos";
import { SabrStream, SabrPlaybackOptions, PlayabilityStatus, SelectedFormats } from "googlevideo/sabr-stream";
import { buildSabrFormat } from "googlevideo/utils";
import { musicLogger } from "@utils";
import { getWebPoMinter } from "./webpo-helper";

export interface DownloadOutput {
  stream: WriteStream;
  filePath: string;
}

export interface StreamResults {
  videoStream: ReadableStream;
  audioStream: ReadableStream;
  selectedFormats: SelectedFormats;
  videoTitle: string;
}

Platform.shim.eval = async (data: Types.BuildScriptResult) => {
  return new Function(data.output)();
};

/**
 * Fetches video details and streaming information from YouTube.
 */
export async function makePlayerRequest(
  innertube: Innertube,
  videoId: string,
  reloadPlaybackContext?: ReloadPlaybackContext
): Promise<IPlayerResponse> {
  const watchEndpoint = new YTNodes.NavigationEndpoint({ watchEndpoint: { videoId } });

  // Note: ypes are from  YTNodes.NavigationEndpoint.call itself
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraArgs: Record<string, any> = {
    playbackContext: {
      adPlaybackContext: { pyv: true },
      contentPlaybackContext: {
        vis: 0,
        splay: false,
        signatureTimestamp: innertube.session.player?.signature_timestamp
      }
    },
    contentCheckOk: true,
    racyCheckOk: true,
    client: "WEB"
  };

  if (reloadPlaybackContext) {
    extraArgs.playbackContext.reloadPlaybackContext = reloadPlaybackContext;
  }

  return await watchEndpoint.call<IPlayerResponse>(innertube.actions, { ...extraArgs, parse: true });
}

export function determineFileExtension(mimeType: string): string {
  if (mimeType.includes("video")) {
    return mimeType.includes("webm") ? "webm" : "mp4";
  } else if (mimeType.includes("audio")) {
    return mimeType.includes("webm") ? "webm" : "m4a";
  }
  return "bin";
}

/**
 * Creates a WritableStream that tracks download progress.
 */
export function createStreamSink(outputStream: WriteStream) {
  // let size = 0; Note: those were for loggin purposes?

  return new WritableStream({
    write(chunk) {
      return new Promise((resolve, reject) => {
        // size += chunk.length; Note: those were for loggin purposes?

        outputStream.write(chunk, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
    close() {
      outputStream.end();
    }
  });
}

/**
 * Initializes Innertube client and sets up SABR streaming for a YouTube video.
 */
export async function createSabrStream(
  videoId: string,
  options: SabrPlaybackOptions
): Promise<{
  innertube: Innertube;
  streamResults: StreamResults;
}> {
  const webpoMinter = await getWebPoMinter();

  const innertube = await Innertube.create({ cache: new UniversalCache(true) });

  // Get video metadata.
  const playerResponse = await makePlayerRequest(innertube, videoId);
  const videoTitle = playerResponse.video_details?.title || "Unknown Video";

  musicLogger.info(`
    Title: ${videoTitle}
    Duration: ${playerResponse.video_details?.duration}
    Views: ${playerResponse.video_details?.view_count}
    Author: ${playerResponse.video_details?.author}
    Video ID: ${playerResponse.video_details?.id}
  `);

  // Now get the streaming information.
  const serverAbrStreamingUrl = await innertube.session.player?.decipher(
    playerResponse.streaming_data?.server_abr_streaming_url
  );
  const videoPlaybackUstreamerConfig =
    playerResponse.player_config?.media_common_config.media_ustreamer_request_config?.video_playback_ustreamer_config;

  if (!videoPlaybackUstreamerConfig) throw new Error("ustreamerConfig not found");
  if (!serverAbrStreamingUrl) throw new Error("serverAbrStreamingUrl not found");

  const sabrFormats = playerResponse.streaming_data?.adaptive_formats.map(buildSabrFormat) || [];
  const clientName = parseInt(
    Constants.CLIENT_NAME_IDS[innertube.session.context.client.clientName as keyof typeof Constants.CLIENT_NAME_IDS]
  );
  const clientVersion = innertube.session.context.client.clientVersion;
  const heartbeatParams = playerResponse.heartbeat_params;

  const serverAbrStream = new SabrStream({
    videoId,
    formats: sabrFormats,
    serverAbrStreamingUrl,
    videoPlaybackUstreamerConfig,
    heartbeatParams: {
      heartbeatToken: heartbeatParams?.heartbeat_token,
      heartbeatServerData: heartbeatParams?.heartbeat_server_data,
      intervalMilliseconds: heartbeatParams?.interval_milliseconds
    },
    clientInfo: {
      clientName,
      clientVersion
    },
    callbacks: {
      onMintPoToken: () => webpoMinter.mint(videoId),
      onReloadPlayerResponse: async (reloadPlaybackContext) => {
        const playerResponse = await makePlayerRequest(innertube, videoId, reloadPlaybackContext);
        const serverAbrStreamingUrl = await innertube.session.player?.decipher(
          playerResponse.streaming_data?.server_abr_streaming_url
        );
        const videoPlaybackUstreamerConfig =
          playerResponse.player_config?.media_common_config.media_ustreamer_request_config
            ?.video_playback_ustreamer_config;

        if (!serverAbrStreamingUrl || !videoPlaybackUstreamerConfig) {
          throw new Error("Missing serverAbrStreamingUrl or videoPlaybackUstreamerConfig in reloaded player response");
        }

        return {
          videoPlaybackUstreamerConfig,
          serverAbrStreamingUrl
        };
      },
      onCheckHeartbeat: async (innertubeRequestBody) => {
        const heartbeatResponse = await innertube.actions.execute("/player/heartbeat", {
          ...innertubeRequestBody,
          parse: true
        });

        if (!heartbeatResponse.playability_status || !heartbeatResponse.playability_status_memo) {
          throw new Error("Invalid heartbeat response: missing playability_status");
        }

        const status = heartbeatResponse.playability_status.status as PlayabilityStatus;
        const pollDelayMs = heartbeatResponse.poll_delay_ms;
        const liveStreamability = heartbeatResponse.playability_status_memo?.getType(YTNodes.LiveStreamability).first();
        const displayEndscreen = !!liveStreamability.display_endscreen;
        const offlineSlate = liveStreamability.offline_slate;
        const broadcastId = liveStreamability.broadcast_id;

        return {
          status,
          displayEndscreen,
          offlineSlatePresent: !!offlineSlate,
          offlineSlateButtonsPresent: !!offlineSlate?.action_buttons.length,
          broadcastId,
          pollDelayMs
        };
      }
    }
  });

  // Handle player response reload events (e.g, when IP changes, or formats expire).

  const { videoStream, audioStream, selectedFormats } = serverAbrStream.start(options);

  return {
    innertube,
    streamResults: {
      videoStream,
      audioStream,
      selectedFormats,
      videoTitle
    }
  };
}
