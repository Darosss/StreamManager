import ytdl from "@distube/ytdl-core";
import { Request, Response } from "express";

export const streamYoutubeVideo = async (req: Request, res: Response) => {
  const videoId = req.params.id;

  if (!videoId) {
    res.status(400).send({ message: "No id provided" });
  } else {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    res.setHeader("Content-Type", "audio/mpeg");

    //TODO: im not sure if its needed at all - this route
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ytdl(videoUrl, { quality: "highestaudio" }).pipe(res as any);
  }
};
