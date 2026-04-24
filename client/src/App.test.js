import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders home link', async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });
});
