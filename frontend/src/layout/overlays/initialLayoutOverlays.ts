import { OverlayKeysType } from "./types";
import { Overlay } from "@services";

export const overlaysKeys: OverlayKeysType = {
  overlayRedemptions: "overlay-redemptions",
  overlayMusicPlayer: "overlay-music-player",
  overlayAchievements: "overlay-achievements",
  overlayChat: "overlay-chat",
};

const defaultsLayoutOpts = {
  isDraggable: false,
  isResizable: false,
  static: false,
};

// prettier-ignore
export const initialLayoutOverlays: Overlay['layout'] = {
  ulg: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 30, h: 30, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 30, h: 30, ...defaultsLayoutOpts },
  ],
  lg: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 25, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 25, h: 25, ...defaultsLayoutOpts },
  ],
  md: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
  ],
  sm: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
  ],
  xs: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 10, h: 10, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 10, h: 10, ...defaultsLayoutOpts },
  ],
  xxs: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 0, y: 5, w: 15, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 5, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 5, h: 5, ...defaultsLayoutOpts },
  ],
};

export const initialToolboxOverlays: Overlay["toolbox"] = {
  ulg: [],
  lg: [],
  md: [],
  sm: [],
  xs: [],
  xxs: [],
};
