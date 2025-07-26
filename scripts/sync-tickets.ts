import fs from 'fs';
import path from 'path';
import { Octokit } from 'octokit';
import yaml from 'js-yaml';

/**
 * Simple exporter: turns every docs/tasks/generated/*.yml into a GitHub Issue.
 *
 * ENV VARS:
 *   GITHUB_TOKEN  – personal access token or GitHub Actions token
 *   GITHUB_REPO   – owner/repo (e.g. senseiiwyze/dashboard)
 */
async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repoSlug = process.env.GITHUB_REPO;
  if (!token || !repoSlug) {
    console.error('GITHUB_TOKEN or GITHUB_REPO not set');
    process.exit(1);
  }
  const [owner, repo] = repoSlug.split('/');
  const octokit = new Octokit({ auth: token });

  const ticketsDir = path.join(process.cwd(), 'docs', 'tasks', 'generated');
  const files = fs.readdirSync(ticketsDir).filter(f => f.endsWith('.yml'));

  for (const file of files) {
    const abs = path.join(ticketsDir, file);
    const raw = fs.readFileSync(abs, 'utf8');
    const data: any = yaml.load(raw);
    const ticket = data.ticket;
    if (!ticket?.id) continue;

    const issueTitle = `${ticket.id}  ${ticket.title}`;
    const labels = ['ai-ticket', ...(ticket.workstream ? [`workstream/${ticket.workstream.replace(/\s+/g, '-').toLowerCase()}`] : [])];

    // Check if issue exists
    const existing = await octokit.rest.search.issuesAndPullRequests({
      q: `repo:${repoSlug} in:title "${ticket.id}" type:issue`,
    });

    if (existing.data.items.length > 0) {
      const number = existing.data.items[0].number;
      await octokit.rest.issues.update({ owner, repo, issue_number: number, body: '```yaml\n' + raw + '\n```', labels });
      console.log(`Updated issue #${number} for ${ticket.id}`);
    } else {
      await octokit.rest.issues.create({ owner, repo, title: issueTitle, body: '```yaml\n' + raw + '\n```', labels });
      console.log(`Created issue for ${ticket.id}`);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 