import { render, screen } from '@testing-library/react';
import LoginPage from '../LoginPage';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock the auth service
jest.mock('@/services/authService', () => ({
  authService: {
    login: jest.fn(),
    socialLogin: jest.fn(),
    logout: jest.fn(),
  },
  SocialProvider: {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    GITHUB: 'github',
  },
}));

// Mock the useLoginForm hook
jest.mock('@/hooks/useLoginForm', () => ({
  useLoginForm: () => ({
    formData: { email: '', password: '' },
    errors: {},
    isSubmitting: false,
    isLoading: false,
    updateField: jest.fn(),
    setErrors: jest.fn(),
    setIsSubmitting: jest.fn(),
    setIsLoading: jest.fn(),
    validateForm: jest.fn().mockReturnValue(true),
    resetForm: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with default props', async () => {
    // Use the async pattern even though LoginPage isn't async
    const component = await LoginPage({});
    render(component);
    
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders with custom heading', async () => {
    const component = await LoginPage({ heading: 'Custom Login' });
    render(component);
    
    expect(screen.getByText('Custom Login')).toBeInTheDocument();
  });

  it('renders social login buttons', async () => {
    const component = await LoginPage({});
    render(component);
    
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
  });

  it('renders signup link', async () => {
    const component = await LoginPage({});
    render(component);
    
    expect(screen.getByText('Need an account?')).toBeInTheDocument();
  });
});