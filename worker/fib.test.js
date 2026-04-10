const fib = require('./fib');

test('fib(5) should return 8', () => {
  expect(fib(5)).toBe(8);
});

test('fib(1) should return 1', () => {
  expect(fib(1)).toBe(1);
});