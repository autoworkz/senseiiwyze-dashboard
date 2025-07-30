/**
 * Hero Component Tests
 * 
 * Tests the Hero229 component functionality including authentication states,
 * loading behavior, and basic rendering.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { Hero229 } from '@/components/hero229';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
}));

// Mock the auth API call
global.fetch = jest.fn();

describe('Hero229 Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders core content', () => {
    render(<Hero229 />);
    
    // Check main content is present
    expect(screen.getByText('Readiness Index')).toBeInTheDocument();
    expect(screen.getByText('Predict Training Success with AI-Powered Skill Assessments')).toBeInTheDocument();
    expect(screen.getByText(/SenseiiWyze's proprietary algorithm/)).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<Hero229 />);
    
    // Should show loading text initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles unauthenticated state correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });
    
    render(<Hero229 />);
    
    // Should eventually show "Get Started" button for unauthenticated users
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
  });

  it('handles authenticated state correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        user: { role: 'learner' }
      }),
    });
    
    render(<Hero229 />);
    
    // Should show dashboard link for authenticated users
    await waitFor(() => {
      expect(screen.getByText(/Go to Dashboard/)).toBeInTheDocument();
    });
  });

  it('has proper semantic structure', () => {
    render(<Hero229 />);
    
    // Should have proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Predict Training Success with AI-Powered Skill Assessments');
    
    // Should have section element
    const section = screen.getByText('Readiness Index').closest('section');
    expect(section).toBeInTheDocument();
  });

  it('calls auth API on mount', () => {
    render(<Hero229 />);
    
    expect(fetch).toHaveBeenCalledWith('/api/auth/session');
  });

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<Hero229 />);
    
    // Should fall back to unauthenticated state
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
  });
});