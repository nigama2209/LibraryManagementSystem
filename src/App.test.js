import { render, screen } from '@testing-library/react';
import Hello from './Hello';

test('renders learn react link', () => {
  render(<Hello />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
