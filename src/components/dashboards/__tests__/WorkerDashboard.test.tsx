import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorkerDashboard } from '../WorkerDashboard';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));

// Mock the DashboardLayout component
jest.mock('@/components/layouts/DashboardLayout', () => ({
  DashboardLayout: ({ children, title, subtitle }: any) => (
    <div data-testid="dashboard-layout">
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  ),
}));

describe('WorkerDashboard', () => {
  it('renders with correct title', () => {
    render(<WorkerDashboard />);
    
    expect(screen.getByText('Worker Dashboard')).toBeInTheDocument();
  });

  it('renders with correct subtitle', () => {
    render(<WorkerDashboard />);
    
    expect(screen.getByText('Training progress and skill development')).toBeInTheDocument();
  });

  it('renders current training section', () => {
    render(<WorkerDashboard />);
    
    expect(screen.getByText('Current Training')).toBeInTheDocument();
  });

  it('displays learning progress metric card', () => {
    render(<WorkerDashboard />);
    
    const progressCard = screen.getByText('Learning Progress').closest('.rounded-lg');
    expect(progressCard).toBeInTheDocument();
    expect(progressCard).toHaveTextContent('Learning Progress');
    expect(progressCard).toHaveTextContent('0%');
    expect(progressCard).toHaveTextContent('Complete');
  });

  it('displays skills mastered metric card', () => {
    render(<WorkerDashboard />);
    
    const skillsCard = screen.getByText('Skills Mastered').closest('.rounded-lg');
    expect(skillsCard).toBeInTheDocument();
    expect(skillsCard).toHaveTextContent('Skills Mastered');
    expect(skillsCard).toHaveTextContent('0');
    expect(skillsCard).toHaveTextContent('Skills');
  });

  it('displays readiness score metric card', () => {
    render(<WorkerDashboard />);
    
    const readinessCard = screen.getByText('Readiness Score').closest('.rounded-lg');
    expect(readinessCard).toBeInTheDocument();
    expect(readinessCard).toHaveTextContent('Readiness Score');
    expect(readinessCard).toHaveTextContent('0');
    expect(readinessCard).toHaveTextContent('Out of 100');
  });

  it('displays study streak metric card', () => {
    render(<WorkerDashboard />);
    
    const streakCard = screen.getByText('Study Streak').closest('.rounded-lg');
    expect(streakCard).toBeInTheDocument();
    expect(streakCard).toHaveTextContent('Study Streak');
    expect(streakCard).toHaveTextContent('0');
    expect(streakCard).toHaveTextContent('Days');
  });

  it('renders with responsive grid layout', () => {
    const { container } = render(<WorkerDashboard />);
    
    const metricsGrid = container.querySelector('.grid');
    expect(metricsGrid).toHaveClass('gap-4', 'sm:grid-cols-2', 'lg:grid-cols-4');
  });

  it('renders metric cards with proper styling', () => {
    const { container } = render(<WorkerDashboard />);
    
    const cards = container.querySelectorAll('.rounded-lg.border');
    expect(cards).toHaveLength(4);
    
    cards.forEach(card => {
      expect(card).toHaveClass('bg-card', 'p-6');
    });
  });

  it('uses semantic color classes for theming', () => {
    const { container } = render(<WorkerDashboard />);
    
    // Check for semantic color classes, not hardcoded colors
    const html = container.innerHTML;
    expect(html).not.toMatch(/bg-gray-/);
    expect(html).not.toMatch(/text-gray-/);
    expect(html).not.toMatch(/bg-slate-/);
    expect(html).not.toMatch(/text-zinc-/);
    
    // Should use semantic classes
    expect(html).toMatch(/text-muted-foreground/);
    expect(html).toMatch(/text-foreground/);
  });
});