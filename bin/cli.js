#!/usr/bin/env node

import { install } from '../src/install.js';
import { update } from '../src/update.js';
import { uninstall } from '../src/uninstall.js';

const args = process.argv.slice(2);
const command = args[0];
const flags = args.slice(1);

const isDryRun = flags.includes('--dry-run');
const isGlobal = flags.includes('-g') || flags.includes('--global');

const showHelp = () => {
  console.log(`
  clawnect - Install the Clawnect skill for AI coding agents

  Usage:
    npx clawnect install     Install Clawnect skill
    npx clawnect update      Update to latest version
    npx clawnect uninstall   Remove Clawnect skill

  Options:
    -g, --global    Install to ~/.claude/skills (user-level)
    --dry-run       Show what would be installed without installing

  Examples:
    npx clawnect install           # Install to current project
    npx clawnect install -g        # Install globally for all projects
    npx clawnect update            # Update skill files

  Learn more: https://clawnect.com
  `);
};

const run = async () => {
  switch (command) {
    case 'install':
      await install({ dryRun: isDryRun, global: isGlobal });
      break;
    case 'update':
      await update({ dryRun: isDryRun, global: isGlobal });
      break;
    case 'uninstall':
    case 'remove':
      await uninstall({ global: isGlobal });
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      if (!command) {
        showHelp();
      } else {
        console.error(`Unknown command: ${command}`);
        console.log('Run "npx clawnect help" for usage info');
        process.exit(1);
      }
  }
};

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
