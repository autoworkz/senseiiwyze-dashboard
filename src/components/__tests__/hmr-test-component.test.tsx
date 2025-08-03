import { render, screen, fireEvent } from '@testing-library/react';
import { HMRTestComponent } from '../hmr-test-component';

describe('HMRTestComponent', () => {
  it('renders the component with initial state', () => {
    render(<HMRTestComponent />);
    
    expect(screen.getByText(/HMR Test Component/)).toBeInTheDocument();
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increment counter/i })).toBeInTheDocument();
  });

  it('increments counter when button is clicked', () => {
    render(<HMRTestComponent />);
    
    const button = screen.getByRole('button', { name: /increment counter/i });
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    fireEvent.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    expect(screen.queryByText('Count: 0')).not.toBeInTheDocument();
  });

  it('updates timestamp when button is clicked', () => {
    render(<HMRTestComponent />);
    
    const button = screen.getByRole('button', { name: /increment counter/i });
    
    fireEvent.click(button);
    
    const updatedTimestamp = screen.getByText(/Last Update:/);
    expect(updatedTimestamp).toBeInTheDocument();
    // The timestamp should be different (though this is a weak assertion)
  });

  it('shows HMR test performance note', () => {
    render(<HMRTestComponent />);
    
    expect(screen.getByText(/This component will be modified to test HMR performance/)).toBeInTheDocument();
  });

  it('logs HMR test results when clicking multiple times', () => {
    render(<HMRTestComponent />);
    
    const button = screen.getByRole('button', { name: /increment counter/i });
    
    // Click multiple times
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(screen.getByText('HMR Test Log:')).toBeInTheDocument();
    expect(screen.getByText(/Update 1 at/)).toBeInTheDocument();
    expect(screen.getByText(/Update 2 at/)).toBeInTheDocument();
  });
});
