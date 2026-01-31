import { install } from './install.js';

export const update = async (options = {}) => {
  console.log('\n  Checking for updates...');

  // For now, update is just a reinstall
  // In the future, could check version from skill.json and compare
  await install(options);
};
