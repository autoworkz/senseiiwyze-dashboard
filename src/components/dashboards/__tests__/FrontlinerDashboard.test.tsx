import React from 'react';
import { render, screen } from '@testing-library/react';
import { FrontlinerDashboard } from '../FrontlinerDashboard';

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

describe('FrontlinerDashboard', () => {
  it('renders with correct title', () => {
    render(<FrontlinerDashboard />);
    
    expect(screen.getByText('Frontliner Dashboard')).toBeInTheDocument();
  });

  it('renders with correct subtitle', () => {
    render(<FrontlinerDashboard />);
    
    expect(screen.getByText('Customer service metrics and performance')).toBeInTheDocument();
  });

  it('renders daily metrics section', () => {
    render(<FrontlinerDashboard />);
    
    expect(screen.getByText('Daily Metrics')).toBeInTheDocument();
  });

  it('displays active tickets metric card', () => {
    render(<FrontlinerDashboard />);
    
    const ticketsCard = screen.getByText('Active Tickets').closest('.rounded-lg');
    expect(ticketsCard).toBeInTheDocument();
    expect(ticketsCard).toHaveTextContent('Active Tickets');
    expect(ticketsCard).toHaveTextContent('0');
    expect(ticketsCard).toHaveTextContent('Open');
  });

  it('displays response time metric card', () => {
    render(<FrontlinerDashboard />);
    
    const responseCard = screen.getByText('Avg Response Time').closest('.rounded-lg');
    expect(responseCard).toBeInTheDocument();
    expect(responseCard).toHaveTextContent('Avg Response Time');
    expect(responseCard).toHaveTextContent('0');
    expect(responseCard).toHaveTextContent('Minutes');
  });

  it('displays customer satisfaction metric card', () => {
    render(<FrontlinerDashboard />);
    
    const satisfactionCard = screen.getByText('Customer Satisfaction').closest('.rounded-lg');
    expect(satisfactionCard).toBeInTheDocument();
    expect(satisfactionCard).toHaveTextContent('Customer Satisfaction');
    expect(satisfactionCard).toHaveTextContent('0%');
    expect(satisfactionCard).toHaveTextContent('Rating');
  });

  it('displays resolved today metric card', () => {
    render(<FrontlinerDashboard />);
    
    const resolvedCard = screen.getByText('Resolved Today').closest('.rounded-lg');
    expect(resolvedCard).toBeInTheDocument();
    expect(resolvedCard).toHaveTextContent('Resolved Today');
    expect(resolvedCard).toHaveTextContent('0');
    expect(resolvedCard).toHaveTextContent('Tickets');
  });

  it('renders with responsive grid layout', () => {
    const { container } = render(<FrontlinerDashboard />);
    
    const metricsGrid = container.querySelector('.grid');
    expect(metricsGrid).toHaveClass('gap-4', 'sm:grid-cols-2', 'lg:grid-cols-4');
  });

  it('renders metric cards with proper styling', () => {
    const { container } = render(<FrontlinerDashboard />);
    
    const cards = container.querySelectorAll('.rounded-lg.border');
    expect(cards).toHaveLength(4);
    
    cards.forEach(card => {
      expect(card).toHaveClass('bg-card', 'p-6');
    });
  });

  it('uses semantic color classes for theming', () => {
    const { container } = render(<FrontlinerDashboard />);
    
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