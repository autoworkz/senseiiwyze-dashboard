/**
 * Mock Service Worker (MSW) Handlers
 * 
 * Define API mocks for development and testing.
 * These run in the browser during development and in Node.js during testing.
 */

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth API mocks
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    // Mock successful login
    if (email === 'admin@example.com' && password === 'password') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        token: 'mock-jwt-token',
      });
    }
    
    // Mock failed login
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // User management API mocks
  http.get('/api/users', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'learner',
        status: 'active',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'coach',
        status: 'active',
      },
    ]);
  }),

  // Dashboard analytics mocks
  http.get('/api/analytics/dashboard', () => {
    return HttpResponse.json({
      totalUsers: 1234,
      activeUsers: 987,
      completionRate: 78.5,
      averageScore: 85.2,
      trends: {
        users: '+12%',
        completion: '+5.2%',
        score: '+3.1%',
      },
    });
  }),

  // Course/training mocks
  http.get('/api/courses', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'React Fundamentals',
        description: 'Learn the basics of React development',
        duration: '4 weeks',
        difficulty: 'beginner',
        enrollments: 156,
      },
      {
        id: '2',
        title: 'Advanced TypeScript',
        description: 'Master advanced TypeScript patterns',
        duration: '6 weeks',
        difficulty: 'advanced',
        enrollments: 89,
      },
    ]);
  }),

  // Readiness Index API mock
  http.post('/api/readiness/assess', async ({ request }) => {
    const _assessmentData = await request.json();
    
    // Mock readiness calculation
    return HttpResponse.json({
      readinessScore: 82,
      confidenceLevel: 'high',
      recommendations: [
        'Focus on advanced JavaScript patterns',
        'Practice with React hooks',
        'Review TypeScript fundamentals',
      ],
      estimatedCompletionTime: '3-4 weeks',
      successProbability: 87,
    });
  }),

  // AI Coaching mock
  http.post('/api/ai/chat', async ({ request }) => {
    const { message } = await request.json() as { message: string };
    
    return HttpResponse.json({
      response: `I understand you're asking about: "${message}". Based on your learning progress, I'd recommend focusing on practical applications. Would you like me to suggest some exercises?`,
      suggestions: [
        'Show me related exercises',
        'Explain this concept further',
        'What should I learn next?',
      ],
    });
  }),
];

export default handlers;