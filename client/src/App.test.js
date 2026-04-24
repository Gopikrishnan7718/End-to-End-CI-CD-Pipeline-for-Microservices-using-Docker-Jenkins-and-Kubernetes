import { render, screen } from '@testing-library/react';
import App from './App';

// 🔥 MOCK Fib component completely
jest.mock('./Fib', () => () => <div>Fib Mock</div>);

test('renders home link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});
