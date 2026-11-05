jest.clearAllMocks();

jest.mock("@twurple/api", () => ({
  ApiClient: jest.fn()
}));
jest.mock("@twurple/auth", () => ({
  RefreshingAuthProvider: jest.fn(),
  getTokenInfo: jest.fn()
}));
jest.mock("@twurple/eventsub-ws", () => ({
  EventSubWsListener: jest.fn()
}));
jest.mock("youtubei.js", () => ({
  Constants: jest.fn(),
  Innertube: jest.fn(),
  IPlayerResponse: jest.fn(),
  Platform: {
    shim: {
      eval: jest.fn()
    }
  },
  Types: jest.fn(),
  UniversalCache: jest.fn(),
  YTNodes: jest.fn()
}));

jest.mock("googlevideo/sabr-stream", () => ({
  SabrStream: jest.fn(),
  SabrPlaybackOptions: jest.fn()
}));
jest.mock("googlevideo/utils", () => ({
  buildSabrFormat: jest.fn(),
  EnabledTrackTypes: jest.fn()
}));

jest.mock("jsdom", () => ({
  JSDOM: jest.fn()
}));

jest.mock("bgutils-js/botguard", () => ({
  BotGuardClient: jest.fn()
}));

jest.mock("bgutils-js/webpo", () => ({
  WebPoMinter: jest.fn()
}));

jest.mock("bgutils-js/utils", () => ({
  getHeaders: jest.fn(),
  buildURL: jest.fn(),
  USER_AGENT: jest.fn(),
  parseLooseJSON: jest.fn()
}));
