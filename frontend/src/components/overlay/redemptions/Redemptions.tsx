import { useEffect, useState } from "react";

import { useSocketContext } from "@socket";
import { getTwitchEmoteUrl, randomWithMax } from "@utils";
import { commonData } from "../commonExampleData";

import { useAppSelector } from "@redux";

export default function Redemptions() {
  const {
    events: { onRedemption },
  } = useSocketContext();

  const {
    isEditor,
    baseData: {
      styles: { overlayRedemptions: styles },
    },
  } = useAppSelector((state) => state.overlays);
  const [redemptionInfo, setRedemptionInfo] = useState(() =>
    isEditor
      ? `${
          commonData.nicknames[randomWithMax(commonData.nicknames.length - 1)]
        } has redeemed - Reward`
      : "",
  );
  const [redemptionImg, setRedemptionImg] = useState(() =>
    isEditor ? getTwitchEmoteUrl({ id: "25" }) : "",
  );
  const [showRedemption, setShowRedemption] = useState(isEditor ? true : false);

  useEffect(() => {
    let source: AudioBufferSourceNode | null = null;

    onRedemption.on((data, audioBuffer) => {
      const { rewardTitle, userDisplayName, rewardImage } = data;
      setRedemptionImg(rewardImage);
      setRedemptionInfo(`${userDisplayName} has redeemed - ${rewardTitle}`);
      setShowRedemption(true);

      const audioCtx = new AudioContext();
      //TODO: replace any later.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioCtx.decodeAudioData(audioBuffer as any, (buffer) => {
        if (source) {
          source.stop();
        }

        source = new AudioBufferSourceNode(audioCtx, {
          buffer: buffer,
        });

        const gainNode = audioCtx.createGain();
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 0.12;

        source.start();

        if (source)
          source.onended = function () {
            setShowRedemption(false);
          };
      });
    });

    return () => {
      onRedemption.off();
    };
  }, [onRedemption]);

  if (showRedemption || isEditor)
    return (
      <div
        className="redemption-wrapper"
        style={{
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
        }}
      >
        <div
          className="redemption-background"
          style={{
            background: styles.background,
            filter: `opacity(${styles.opacity}%)`,
          }}
        ></div>
        <div>
          {redemptionImg ? (
            <img
              alt="no"
              src={redemptionImg}
              style={{
                maxWidth: styles.imageSize,
                minWidth: styles.imageSize,
              }}
            />
          ) : null}
        </div>
        <div className="redemption-popup" style={{ fontSize: styles.fontSize }}>
          {redemptionInfo}
        </div>
      </div>
    );
  else {
    return <></>;
  }
}
