import { rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

const fileExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export const uninstall = async (options = {}) => {
  const { global: isGlobal = false } = options;

  const baseDir = isGlobal
    ? join(homedir(), '.claude', 'skills', 'clawnect')
    : join(process.cwd(), '.claude', 'skills', 'clawnect');

  const scopeLabel = isGlobal ? 'global' : 'project';

  console.log(`\n  Uninstalling Clawnect skill (${scopeLabel})...\n`);

  if (!(await fileExists(baseDir))) {
    console.log(`  Clawnect skill not found at: ${baseDir}`);
    console.log('  Nothing to uninstall.\n');
    return;
  }

  await rm(baseDir, { recursive: true, force: true });

  console.log(`  Clawnect skill removed from: ${baseDir}\n`);
};
