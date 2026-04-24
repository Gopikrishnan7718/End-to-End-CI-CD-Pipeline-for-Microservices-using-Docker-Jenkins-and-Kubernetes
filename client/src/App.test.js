import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders home link', async () => {
  axios.get.mockResolvedValue({ data: {} });

  render(<App />);

  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});
