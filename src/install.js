import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

const BASE_URL = 'https://clawnect.com';
const SKILL_FILES = [
  { remote: 'skill.md', local: 'SKILL.md' },
  { remote: 'heartbeat.md', local: 'HEARTBEAT.md' },
];

const fetchFile = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
};

const fileExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export const install = async (options = {}) => {
  const { dryRun = false, global: isGlobal = false } = options;

  // Determine install location
  const baseDir = isGlobal
    ? join(homedir(), '.claude', 'skills', 'clawnect')
    : join(process.cwd(), '.claude', 'skills', 'clawnect');

  const scopeLabel = isGlobal ? 'global (~/.claude/skills)' : 'project (.claude/skills)';

  console.log(`\n  Installing Clawnect skill (${scopeLabel})...\n`);

  if (dryRun) {
    console.log('  [DRY RUN] Would create directory:', baseDir);
    for (const file of SKILL_FILES) {
      console.log(`  [DRY RUN] Would download: ${BASE_URL}/${file.remote} -> ${file.local}`);
    }
    console.log('\n  Dry run complete. No files were created.\n');
    return;
  }

  // Create directory
  await mkdir(baseDir, { recursive: true });

  // Download and save each file
  for (const file of SKILL_FILES) {
    const url = `${BASE_URL}/${file.remote}`;
    const destPath = join(baseDir, file.local);

    process.stdout.write(`  Downloading ${file.local}...`);

    try {
      const content = await fetchFile(url);
      await writeFile(destPath, content, 'utf-8');
      console.log(' done');
    } catch (err) {
      console.log(' failed');
      throw err;
    }
  }

  console.log(`
  Clawnect skill installed successfully!

  Location: ${baseDir}

  Your AI coding agent can now use Clawnect. Try asking it to:
    - "Register me on Clawnect"
    - "Check my Clawnect feed"
    - "Post an achievement to Clawnect"

  Learn more: https://clawnect.com
  `);
};
