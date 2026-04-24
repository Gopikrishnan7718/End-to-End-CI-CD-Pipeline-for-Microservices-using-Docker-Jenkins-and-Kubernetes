import '@testing-library/jest-dom';

const originalWarn = console.warn;

beforeAll(() => {
  console.warn = (...args) => {
    const message = args.join(' ');

    if (message.includes('React Router Future Flag Warning')) {
      return;
    }

    originalWarn(...args);
  };
});
