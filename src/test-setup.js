// Mock browser environment
const mockBrowserEnv = {
  localStorage: {
    data: {},
    getItem(key) {
      return this.data[key];
    },
    setItem(key, value) {
      this.data[key] = value;
    },
    clear() {
      this.data = {};
    },
  },
  location: {
    _href: "",
    get href() {
      return this._href;
    },
    set href(value) {
      this._href = value;
    },
  },
  Sentry: {
    captureException: jest.fn(),
    captureMessage: jest.fn(),
  },
  hbspt: {
    forms: {
      create: jest.fn(),
    },
  },
  FormRouterConfig: null, // Will be set when config is loaded
  handleRedirect: jest.fn(),
  addEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

// Setup global mocks
global.window = mockBrowserEnv;
global.localStorage = mockBrowserEnv.localStorage;
global.location = mockBrowserEnv.location;
global.Sentry = mockBrowserEnv.Sentry;
global.hbspt = mockBrowserEnv.hbspt;
global.document = {
  querySelector: jest.fn(),
};

// Mock Event constructors
global.Event = class Event {
  constructor(type) {
    this.type = type;
  }
};

global.MessageEvent = class MessageEvent extends Event {
  constructor(type, init) {
    super(type);
    this.data = init.data;
  }
};
