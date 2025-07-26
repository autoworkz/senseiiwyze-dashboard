#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { select, confirm, input, editor } from '@inquirer/prompts';
import chalk from 'chalk';

/**
 * CLI tool to review tickets, cross-reference with standards, and analyze with Fireworks.ai
 * 
 * Usage: pnpm tsx scripts/analyze-tickets.ts
 * 
 * ENV VARS:
 *   FIREWORKS_API_KEY - Your Fireworks.ai API key
 */

interface Ticket {
  id: string;
  title: string;
  description: string;
  workstream?: string;
  priority?: string;
  status?: string;
  acceptanceCriteria?: string[];
  technicalRequirements?: string[];
  dependencies?: string[];
  [key: string]: any;
}

interface CompanyStandard {
  id: string;
  name: string;
  category: string;
  requirements: string[];
}

// Load company standards (you can customize this path)
const STANDARDS_PATH = path.join(process.cwd(), 'docs', 'standards', 'company-standards.yml');
const TICKETS_DIR = path.join(process.cwd(), 'docs', 'tasks', 'generated');

async function loadStandards(): Promise<CompanyStandard[]> {
  try {
    if (fs.existsSync(STANDARDS_PATH)) {
      const content = fs.readFileSync(STANDARDS_PATH, 'utf8');
      const data = yaml.load(content) as { standards: CompanyStandard[] };
      return data.standards || [];
    }
  } catch (error) {
    console.warn(chalk.yellow('⚠️  No company standards file found. Proceeding without standards.'));
  }
  return [];
}

async function loadTickets(): Promise<{ ticket: Ticket; filePath: string }[]> {
  if (!fs.existsSync(TICKETS_DIR)) {
    fs.mkdirSync(TICKETS_DIR, { recursive: true });
    console.log(chalk.yellow(`📁 Created directory: ${TICKETS_DIR}`));
    return [];
  }

  const files = fs.readdirSync(TICKETS_DIR).filter(f => f.endsWith('.yml'));
  const tickets: { ticket: Ticket; filePath: string }[] = [];

  for (const file of files) {
    const filePath = path.join(TICKETS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content) as { ticket: Ticket };
    if (data.ticket?.id) {
      tickets.push({ ticket: data.ticket, filePath });
    }
  }

  return tickets;
}

function displayTicket(ticket: Ticket, standards: CompanyStandard[]) {
  console.log(chalk.cyan('\n' + '='.repeat(80)));
  console.log(chalk.bold.white(`📋 Ticket: ${ticket.id} - ${ticket.title}`));
  console.log(chalk.cyan('='.repeat(80)));
  
  console.log(chalk.gray('\nDescription:'));
  console.log(ticket.description);

  if (ticket.workstream) {
    console.log(chalk.gray('\nWorkstream:'), chalk.yellow(ticket.workstream));
  }

  if (ticket.priority) {
    const priorityColor = ticket.priority === 'high' ? chalk.red : 
                         ticket.priority === 'medium' ? chalk.yellow : chalk.green;
    console.log(chalk.gray('Priority:'), priorityColor(ticket.priority));
  }

  if (ticket.acceptanceCriteria?.length) {
    console.log(chalk.gray('\nAcceptance Criteria:'));
    ticket.acceptanceCriteria.forEach((criteria, i) => {
      console.log(chalk.gray(`  ${i + 1}.`), criteria);
    });
  }

  if (ticket.technicalRequirements?.length) {
    console.log(chalk.gray('\nTechnical Requirements:'));
    ticket.technicalRequirements.forEach((req, i) => {
      console.log(chalk.gray(`  ${i + 1}.`), req);
    });
  }

  // Cross-reference with standards
  const relevantStandards = standards.filter(std => {
    // Simple matching logic - you can make this more sophisticated
    if (ticket.workstream?.toLowerCase().includes('auth') && std.category === 'security') return true;
    if (ticket.workstream?.toLowerCase().includes('ui') && std.category === 'design') return true;
    if (ticket.title.toLowerCase().includes(std.category.toLowerCase())) return true;
    return false;
  });

  if (relevantStandards.length > 0) {
    console.log(chalk.gray('\n📏 Relevant Company Standards:'));
    relevantStandards.forEach(std => {
      console.log(chalk.magenta(`  • ${std.name} (${std.category})`));
      std.requirements.forEach(req => {
        console.log(chalk.gray(`    - ${req}`));
      });
    });
  }
}

async function analyzeWithFireworks(ticket: Ticket, standards: CompanyStandard[], customPrompt?: string) {
  const apiKey = process.env.FIREWORKS_API_KEY;
  
  if (!apiKey) {
    console.error(chalk.red('\n❌ FIREWORKS_API_KEY environment variable not set!'));
    console.log(chalk.yellow('Please set your Fireworks.ai API key:'));
    console.log(chalk.gray('export FIREWORKS_API_KEY="your-api-key-here"'));
    return;
  }

  const relevantStandards = standards.filter(std => {
    if (ticket.workstream?.toLowerCase().includes('auth') && std.category === 'security') return true;
    if (ticket.workstream?.toLowerCase().includes('ui') && std.category === 'design') return true;
    return false;
  });

  const standardsContext = relevantStandards.length > 0 
    ? `\n\nRelevant Company Standards:\n${relevantStandards.map(s => 
        `${s.name} (${s.category}):\n${s.requirements.map(r => `  - ${r}`).join('\n')}`
      ).join('\n\n')}`
    : '';

  const prompt = customPrompt || `Analyze this ticket and provide:
1. Implementation approach and best practices
2. Potential risks or blockers
3. Estimated effort (in story points or days)
4. Recommended next steps
5. Any conflicts with company standards

Ticket Details:
ID: ${ticket.id}
Title: ${ticket.title}
Description: ${ticket.description}
Workstream: ${ticket.workstream || 'Not specified'}
Priority: ${ticket.priority || 'Not specified'}

Acceptance Criteria:
${ticket.acceptanceCriteria?.map(c => `- ${c}`).join('\n') || 'None specified'}

Technical Requirements:
${ticket.technicalRequirements?.map(r => `- ${r}`).join('\n') || 'None specified'}
${standardsContext}`;

  console.log(chalk.blue('\n🤖 Sending to Fireworks.ai...'));

  try {
    const response = await fetch('https://api.fireworks.ai/inference/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/mixtral-8x7b-instruct',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].text;

    console.log(chalk.green('\n✅ AI Analysis:'));
    console.log(chalk.white(analysis));
  } catch (error) {
    console.error(chalk.red('\n❌ Error calling Fireworks.ai:'), error);
  }
}

async function main() {
  console.log(chalk.bold.blue('🎫 Ticket Analysis Tool with Fireworks.ai\n'));

  // Check for API key
  if (!process.env.FIREWORKS_API_KEY) {
    console.warn(chalk.yellow('⚠️  FIREWORKS_API_KEY not set. You won\'t be able to analyze tickets.'));
  }

  const standards = await loadStandards();
  const tickets = await loadTickets();

  if (tickets.length === 0) {
    console.log(chalk.yellow('No tickets found in ' + TICKETS_DIR));
    return;
  }

  console.log(chalk.green(`Found ${tickets.length} tickets and ${standards.length} company standards.\n`));

  let continueAnalyzing = true;

  while (continueAnalyzing) {
    // Select a ticket
    const ticketChoice = await select({
      message: 'Select a ticket to analyze:',
      choices: tickets.map(({ ticket }) => ({
        name: `${ticket.id}: ${ticket.title} ${ticket.priority ? chalk.gray(`[${ticket.priority}]`) : ''}`,
        value: ticket.id,
      })),
    });

    const selectedTicket = tickets.find(t => t.ticket.id === ticketChoice);
    if (!selectedTicket) continue;

    // Display the ticket
    displayTicket(selectedTicket.ticket, standards);

    // Action menu
    const action = await select({
      message: '\nWhat would you like to do?',
      choices: [
        { name: '🤖 Analyze with Fireworks.ai (default prompt)', value: 'analyze' },
        { name: '✏️  Analyze with custom prompt', value: 'custom' },
        { name: '📄 View raw YAML', value: 'yaml' },
        { name: '🔙 Select another ticket', value: 'back' },
        { name: '🚪 Exit', value: 'exit' },
      ],
    });

    switch (action) {
      case 'analyze':
        await analyzeWithFireworks(selectedTicket.ticket, standards);
        break;

      case 'custom':
        const customPrompt = await editor({
          message: 'Enter your custom prompt for analysis:',
          default: `Analyze ticket ${selectedTicket.ticket.id} and provide insights...`,
        });
        await analyzeWithFireworks(selectedTicket.ticket, standards, customPrompt);
        break;

      case 'yaml':
        const yamlContent = fs.readFileSync(selectedTicket.filePath, 'utf8');
        console.log(chalk.gray('\n--- RAW YAML ---'));
        console.log(yamlContent);
        console.log(chalk.gray('--- END YAML ---\n'));
        break;

      case 'exit':
        continueAnalyzing = false;
        break;
    }

    if (action !== 'back' && action !== 'exit') {
      continueAnalyzing = await confirm({
        message: 'Analyze another ticket?',
        default: true,
      });
    }
  }

  console.log(chalk.blue('\n👋 Thanks for using the ticket analyzer!'));
}

// Run the tool
main().catch(console.error);