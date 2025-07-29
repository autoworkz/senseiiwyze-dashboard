import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardLayout } from '../DashboardLayout';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));

describe('DashboardLayout', () => {
  it('renders children content', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    render(
      <DashboardLayout title="Dashboard Title">
        <div>Content</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('Dashboard Title')).toBeInTheDocument();
  });

  it('renders with subtitle when provided', () => {
    render(
      <DashboardLayout title="Title" subtitle="Subtitle text">
        <div>Content</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
  });

  it('applies responsive padding classes', () => {
    const { container } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );
    
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('px-4 sm:px-6 lg:px-8');
  });

  it('renders with full width when specified', () => {
    const { container } = render(
      <DashboardLayout fullWidth>
        <div>Content</div>
      </DashboardLayout>
    );
    
    const contentDiv = container.querySelector('.mx-auto');
    expect(contentDiv).not.toHaveClass('max-w-7xl');
  });

  it('renders action buttons when provided', () => {
    const actions = (
      <button type="button">Action Button</button>
    );
    
    render(
      <DashboardLayout title="Title" actions={actions}>
        <div>Content</div>
      </DashboardLayout>
    );
    
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });
});