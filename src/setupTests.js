import "@testing-library/jest-dom";

// Mock setTimeout
jest.useFakeTimers();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.location
delete window.location;
window.location = {
  href: "",
  pathname: "",
};

// Mock HubSpot form
global.hbspt = {
  forms: {
    create: jest.fn(),
  },
};

// Mock Sentry
global.Sentry = {
  captureException: jest.fn(),
};

// Mock ChiliPiper
global.ChiliPiper = {
  submit: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
  window.location.href = "";
  window.location.pathname = "";
  jest.clearAllTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});
