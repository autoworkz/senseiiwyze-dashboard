/**
 * Hero Component Tests
 * 
 * Tests the Hero229 component functionality including authentication states,
 * loading behavior, and basic rendering.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { Hero229 } from '@/components/hero229';
import { authClient } from '@/lib/auth-client';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
}));

// Mock the Navigation component to avoid complex navigation testing
vi.mock('@/components/navigation/Navbar1', () => ({
  Navbar1: () => <nav data-testid="navbar">Navigation</nav>,
}));

// Mock the auth client module completely
vi.mock('@/lib/auth-client', () => {
  const mockGetSession = vi.fn();
  return {
    authClient: {
      getSession: mockGetSession,
    },
    __mockGetSession: mockGetSession, // Export for access in tests
  };
});

describe('Hero229 Component', () => {
  // Get the mock function
  const mockGetSession = vi.mocked(authClient.getSession);

  beforeEach(() => {
    vi.clearAllMocks();
    // Default to unauthenticated state
    mockGetSession.mockResolvedValue({
      data: null,
      error: null,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders basic navigation', () => {
    render(<Hero229 />);
    
    // Check that navigation is rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders core hero content', () => {
    render(<Hero229 />);
    
    // Check main content is present
    expect(screen.getByText('Readiness Index')).toBeInTheDocument();
    expect(screen.getByText('Predict Training Success with AI-Powered Skill Assessments')).toBeInTheDocument();
    expect(screen.getByText(/SenseiiWyze's proprietary algorithm/)).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('calls auth client on mount', () => {
    render(<Hero229 />);
    
    expect(mockGetSession).toHaveBeenCalled();
  });

  it('shows loading state initially', () => {
    render(<Hero229 />);
    
    // Should show loading text initially (in the button)
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles unauthenticated state correctly', async () => {
    mockGetSession.mockResolvedValue({
      data: null,
      error: null,
    });
    
    render(<Hero229 />);
    
    // Should eventually show "Get Started" button for unauthenticated users
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles authenticated state correctly', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        user: { id: '1', role: 'learner', email: 'test@example.com' },
        session: { id: 'session-1' }
      },
      error: null,
    });
    
    render(<Hero229 />);
    
    // Should show "Go to Dashboard" button for authenticated users
    await waitFor(() => {
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles auth client errors gracefully', async () => {
    mockGetSession.mockRejectedValue(new Error('Network error'));
    
    render(<Hero229 />);
    
    // Should fall back to unauthenticated state
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});