import React from 'react';
import { render, screen } from '@testing-library/react';
import { CEODashboard } from '../CEODashboard';

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

describe('CEODashboard', () => {
  it('renders with correct title', () => {
    render(<CEODashboard />);
    
    expect(screen.getByText('CEO Dashboard')).toBeInTheDocument();
  });

  it('renders with correct subtitle', () => {
    render(<CEODashboard />);
    
    expect(screen.getByText('Executive overview and company metrics')).toBeInTheDocument();
  });

  it('renders key metrics section', () => {
    render(<CEODashboard />);
    
    expect(screen.getByText('Key Metrics')).toBeInTheDocument();
  });

  it('displays revenue metric card', () => {
    render(<CEODashboard />);
    
    const revenueCard = screen.getByText('Monthly Recurring Revenue').closest('.rounded-lg');
    expect(revenueCard).toBeInTheDocument();
    expect(revenueCard).toHaveTextContent('Monthly Recurring Revenue');
    expect(revenueCard).toHaveTextContent('$0');
    expect(revenueCard).toHaveTextContent('+0% from last month');
  });

  it('displays active learners metric card', () => {
    render(<CEODashboard />);
    
    const learnersCard = screen.getByText('Active Learners').closest('.rounded-lg');
    expect(learnersCard).toBeInTheDocument();
    expect(learnersCard).toHaveTextContent('Active Learners');
    expect(learnersCard).toHaveTextContent('0');
    expect(learnersCard).toHaveTextContent('+0% from last month');
  });

  it('displays completion rate metric card', () => {
    render(<CEODashboard />);
    
    const completionCard = screen.getByText('Completion Rate').closest('.rounded-lg');
    expect(completionCard).toBeInTheDocument();
    expect(completionCard).toHaveTextContent('Completion Rate');
    expect(completionCard).toHaveTextContent('0%');
    expect(completionCard).toHaveTextContent('+0% from last month');
  });

  it('displays readiness index accuracy metric card', () => {
    render(<CEODashboard />);
    
    const readinessCard = screen.getByText('Readiness Index Accuracy').closest('.rounded-lg');
    expect(readinessCard).toBeInTheDocument();
    expect(readinessCard).toHaveTextContent('Readiness Index Accuracy');
    expect(readinessCard).toHaveTextContent('0%');
    expect(readinessCard).toHaveTextContent('+0% from last month');
  });

  it('renders with responsive grid layout', () => {
    const { container } = render(<CEODashboard />);
    
    const metricsGrid = container.querySelector('.grid');
    expect(metricsGrid).toHaveClass('gap-4', 'sm:grid-cols-2', 'lg:grid-cols-4');
  });

  it('renders metric cards with proper styling', () => {
    const { container } = render(<CEODashboard />);
    
    const cards = container.querySelectorAll('.rounded-lg.border');
    expect(cards).toHaveLength(4);
    
    cards.forEach(card => {
      expect(card).toHaveClass('bg-card', 'p-6');
    });
  });

  it('uses semantic color classes for theming', () => {
    const { container } = render(<CEODashboard />);
    
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