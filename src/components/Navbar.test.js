import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

test('renders navbar with appropriate text', () => {
    render(<Navbar />);
    const linkElement = screen.getByText(/IoT Dashboard/i);
    expect(linkElement).toBeInTheDocument();
});
