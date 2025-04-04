import { render, screen } from '@testing-library/react';
import App from './App';

test('renders description text', () => {
  render(<App />);
  const linkElement = screen.getByText(/find and replace/i);
  expect(linkElement).toBeInTheDocument();
});
