const fs = require('fs');
const path = require('path');

const directory = 'cli';

const oldCLiPath = path.join(directory, 'cli.js');
const newCLiPath = path.join(directory, 'cli.cjs');

fs.renameSync(oldCLiPath, newCLiPath);