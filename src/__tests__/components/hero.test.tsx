/**
 * Hero Component Translation Tests
 * 
 * Tests the Hero229 component to ensure all translations work correctly
 * across all supported locales and that dynamic content renders properly.
 */

import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
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

  it('renders all translated content in English', async () => {
    const messages = await import('@/messages/en.json');
    
    render(
      <NextIntlClientProvider locale="en" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    // Check hero content
    expect(screen.getByText(messages.default.hero.readinessIndex)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.headline)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.description)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.learnMore)).toBeInTheDocument();
    
    // Wait for component to load (it shows Loading... initially)
    await screen.findByText(messages.default.hero.getStarted);
  });

  it('renders correctly in Spanish', async () => {
    const messages = await import('@/messages/es.json');
    
    render(
      <NextIntlClientProvider locale="es" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText(messages.default.hero.readinessIndex)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.headline)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.description)).toBeInTheDocument();
  });

  it('renders correctly in French', async () => {
    const messages = await import('@/messages/fr.json');
    
    render(
      <NextIntlClientProvider locale="fr" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText(messages.default.hero.readinessIndex)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.headline)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.description)).toBeInTheDocument();
  });

  it('renders correctly in German', async () => {
    const messages = await import('@/messages/de.json');
    
    render(
      <NextIntlClientProvider locale="de" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText(messages.default.hero.readinessIndex)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.headline)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.description)).toBeInTheDocument();
  });

  it('renders correctly in Japanese', async () => {
    const messages = await import('@/messages/ja.json');
    
    render(
      <NextIntlClientProvider locale="ja" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText(messages.default.hero.readinessIndex)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.headline)).toBeInTheDocument();
    expect(screen.getByText(messages.default.hero.description)).toBeInTheDocument();
  });

  it('works with all supported locales', async () => {
    const locales = ['en', 'es', 'fr', 'de', 'ja'];
    
    for (const locale of locales) {
      const messages = await import(`@/messages/${locale}.json`);
      
      const { unmount } = render(
        <NextIntlClientProvider locale={locale} messages={messages.default}>
          <Hero229 />
        </NextIntlClientProvider>
      );
      
      // Verify key elements are present
      expect(screen.getByText(messages.default.hero.headline)).toBeInTheDocument();
      expect(screen.getByText(messages.default.hero.description)).toBeInTheDocument();
      expect(screen.getByText(messages.default.hero.readinessIndex)).toBeInTheDocument();
      
      // Clean up for next iteration
      unmount();
    }
  });

  it('handles unauthenticated state correctly', async () => {
    const messages = await import('@/messages/en.json');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });
    
    render(
      <NextIntlClientProvider locale="en" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    // Should show "Get Started" button for unauthenticated users
    await screen.findByText(messages.default.hero.getStarted);
    expect(screen.getByText(messages.default.hero.getStarted)).toBeInTheDocument();
  });

  it('handles authenticated state correctly', async () => {
    const messages = await import('@/messages/en.json');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        user: { role: 'learner' }
      }),
    });
    
    render(
      <NextIntlClientProvider locale="en" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    // Should show dashboard button for authenticated users
    await screen.findByText(/dashboard/i);
  });

  it('has proper semantic structure', async () => {
    const messages = await import('@/messages/en.json');
    
    render(
      <NextIntlClientProvider locale="en" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    // Check semantic HTML structure - section doesn't have implicit banner role
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3); // Readiness Index, Learn More, Loading/Get Started
  });

  it('displays loading state correctly', async () => {
    const messages = await import('@/messages/en.json');
    
    // Mock a slow fetch to test loading state
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: false }), 1000))
    );
    
    render(
      <NextIntlClientProvider locale="en" messages={messages.default}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    // Should show loading state initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Check that the button containing "Loading..." is disabled
    const loadingButton = screen.getByText('Loading...').closest('button');
    expect(loadingButton).toBeDisabled();
  });
});