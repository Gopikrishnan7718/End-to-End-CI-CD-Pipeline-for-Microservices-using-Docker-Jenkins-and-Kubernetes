function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

test('fib(5) should be 8', () => {
  expect(fib(5)).toBe(8);
});