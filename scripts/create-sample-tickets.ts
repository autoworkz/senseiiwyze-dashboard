#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { dump } from 'js-yaml';
import chalk from 'chalk';

/**
 * Creates sample ticket YAML files for testing the analyze-tickets.ts tool
 * 
 * Usage: pnpm tsx scripts/create-sample-tickets.ts
 */

const TICKETS_DIR = path.join(process.cwd(), 'docs', 'tasks', 'generated');

const sampleTickets = [
  {
    ticket: {
      id: 'SENSEI-001',
      title: 'Implement User Authentication System',
      description: 'Set up Better Auth with email/password and OAuth providers (Google, GitHub, Discord) for the SenseiiWyze platform.',
      workstream: 'authentication',
      priority: 'high',
      status: 'in-progress',
      acceptanceCriteria: [
        'Users can sign up with email/password',
        'OAuth login works with Google, GitHub, Discord',
        'Session management is secure with JWT tokens',
        'Password reset flow is implemented via email',
        'Two-factor authentication is available',
        'Rate limiting prevents brute force attacks'
      ],
      technicalRequirements: [
        'Better Auth library integration',
        'Resend email service for magic links',
        'PostgreSQL database for user storage',
        'JWT token management with secure cookies',
        'Environment variables for OAuth credentials'
      ],
      dependencies: [],
      metadata: {
        estimatedEffort: '5 days',
        assignee: 'backend-team',
        sprint: 'Sprint 1'
      }
    }
  },
  {
    ticket: {
      id: 'SENSEI-002',
      title: 'Create Role-Based Dashboard Views',
      description: 'Build responsive dashboard layouts with different views for Admin, Corporate, Coach, Learner, and Guest users.',
      workstream: 'ui',
      priority: 'high',
      status: 'pending',
      acceptanceCriteria: [
        'Five different dashboard views implemented',
        'Responsive design works on mobile and desktop',
        'Account switcher component allows role switching',
        'Real-time data updates using WebSocket or polling',
        'Loading states for all async operations',
        'Error boundaries prevent crashes'
      ],
      technicalRequirements: [
        'Next.js 15 App Router',
        'shadcn/ui component library',
        'Tailwind CSS for styling',
        'Zustand for state management',
        'React Query for data fetching'
      ],
      dependencies: ['SENSEI-001'],
      metadata: {
        estimatedEffort: '8 days',
        assignee: 'frontend-team',
        sprint: 'Sprint 1'
      }
    }
  },
  {
    ticket: {
      id: 'SENSEI-003',
      title: 'Implement Readiness Index Algorithm',
      description: 'Build the core AI-powered assessment algorithm that predicts training success with 87% accuracy.',
      workstream: 'ai',
      priority: 'critical',
      status: 'planning',
      acceptanceCriteria: [
        'Algorithm processes 50+ learner attributes',
        'Prediction accuracy >= 85% on test data',
        'Results returned within 2 seconds',
        'Confidence scores included with predictions',
        'Explainable AI outputs for transparency',
        'A/B testing framework integrated'
      ],
      technicalRequirements: [
        'TensorFlow.js for client-side predictions',
        'Python backend with scikit-learn for training',
        'FastAPI for model serving',
        'PostgreSQL for storing assessment data',
        'Redis for caching predictions'
      ],
      dependencies: ['SENSEI-001', 'SENSEI-004'],
      metadata: {
        estimatedEffort: '15 days',
        assignee: 'ml-team',
        sprint: 'Sprint 2'
      }
    }
  },
  {
    ticket: {
      id: 'SENSEI-004',
      title: 'Set Up Database Schema and Migrations',
      description: 'Design and implement the database schema for users, assessments, learning paths, and analytics.',
      workstream: 'database',
      priority: 'high',
      status: 'pending',
      acceptanceCriteria: [
        'Database schema supports all entity relationships',
        'Migrations are versioned and reversible',
        'Indexes optimize query performance',
        'Soft deletes preserve audit trails',
        'Data encryption for PII fields',
        'Backup strategy documented'
      ],
      technicalRequirements: [
        'PostgreSQL with Drizzle ORM',
        'Database migrations with Drizzle Kit',
        'Connection pooling configured',
        'Read replicas for analytics',
        'Encryption at rest enabled'
      ],
      dependencies: [],
      metadata: {
        estimatedEffort: '3 days',
        assignee: 'backend-team',
        sprint: 'Sprint 1'
      }
    }
  },
  {
    ticket: {
      id: 'SENSEI-005',
      title: 'Implement API Rate Limiting and Security',
      description: 'Add rate limiting, CORS, and security headers to protect the API endpoints.',
      workstream: 'security',
      priority: 'high',
      status: 'pending',
      acceptanceCriteria: [
        'Rate limiting: 100 requests per minute per user',
        'CORS configured for allowed origins',
        'Security headers prevent common attacks',
        'API versioning implemented',
        'Request validation with Zod schemas',
        'Error responses follow RFC 7807'
      ],
      technicalRequirements: [
        'Next.js middleware for rate limiting',
        'Redis for rate limit counters',
        'Helmet.js for security headers',
        'Zod for request validation',
        'OpenAPI documentation'
      ],
      dependencies: ['SENSEI-001'],
      metadata: {
        estimatedEffort: '2 days',
        assignee: 'backend-team',
        sprint: 'Sprint 1'
      }
    }
  },
  {
    ticket: {
      id: 'SENSEI-006',
      title: 'Create AI Coaching Chat Interface',
      description: 'Build the conversational AI interface for personalized learning guidance using GPT-4.',
      workstream: 'ai',
      priority: 'medium',
      status: 'pending',
      acceptanceCriteria: [
        'Chat interface supports markdown formatting',
        'Message history persisted per user',
        'Streaming responses for better UX',
        'Context-aware responses based on learner profile',
        'Fallback when AI service unavailable',
        'Content moderation filters inappropriate content'
      ],
      technicalRequirements: [
        'OpenAI GPT-4 API integration',
        'WebSocket for real-time messaging',
        'PostgreSQL for chat history',
        'Redis for session state',
        'React components for chat UI'
      ],
      dependencies: ['SENSEI-001', 'SENSEI-002'],
      metadata: {
        estimatedEffort: '5 days',
        assignee: 'ai-team',
        sprint: 'Sprint 2'
      }
    }
  }
];

async function createSampleTickets() {
  console.log(chalk.bold.blue('📝 Creating Sample Tickets for SenseiiWyze\n'));

  // Ensure directory exists
  if (!fs.existsSync(TICKETS_DIR)) {
    fs.mkdirSync(TICKETS_DIR, { recursive: true });
    console.log(chalk.green(`✅ Created directory: ${TICKETS_DIR}`));
  }

  let created = 0;
  let skipped = 0;

  for (const ticketData of sampleTickets) {
    const filename = `${ticketData.ticket.id.toLowerCase()}.yml`;
    const filepath = path.join(TICKETS_DIR, filename);

    if (fs.existsSync(filepath)) {
      console.log(chalk.yellow(`⏭️  Skipped: ${filename} (already exists)`));
      skipped++;
      continue;
    }

    const yamlContent = dump(ticketData, {
      indent: 2,
      lineWidth: 120,
      noRefs: true
    });

    fs.writeFileSync(filepath, yamlContent);
    console.log(chalk.green(`✅ Created: ${filename}`));
    created++;
  }

  console.log(chalk.bold.cyan(`\n📊 Summary:`));
  console.log(chalk.white(`   Created: ${created} tickets`));
  console.log(chalk.white(`   Skipped: ${skipped} tickets`));
  console.log(chalk.white(`   Total:   ${sampleTickets.length} tickets`));

  console.log(chalk.bold.blue('\n🚀 Next Steps:'));
  console.log(chalk.white('1. Run the ticket analyzer:'));
  console.log(chalk.gray('   pnpm tsx scripts/analyze-tickets.ts'));
  console.log(chalk.white('\n2. Or sync tickets to GitHub:'));
  console.log(chalk.gray('   GITHUB_TOKEN=your-token GITHUB_REPO=owner/repo pnpm tsx scripts/sync-tickets.ts'));
}

// Run the script
createSampleTickets().catch(console.error);