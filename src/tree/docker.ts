import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from "child_process";

const dockerFile = `FROM node:16\nWORKDIR /app\nRUN npm install tree-sitter`;

export function processFile(filename: string) {
  const extension = filename.split('.').pop();
  if (!extension) {
    console.error('File extension not found');
    return;
  }
  buildAndCopyFile(filename, extension);
  runExtractionScript();
  const localModsPath = 'path/to/your/local_modifications_file';
  copyModifications(localModsPath);
  runModificationScript();
  copyModifiedFileToLocal(filename);
}

function buildAndCopyFile(filename: string, extension: string) {
  const imageName = 'my-node-image';
  const containerName = 'my-node-container';

  if (!containerExists(containerName)) {
    const tempDockerfilePath = writeTempDockerfile(dockerFile);
    execSync(`docker build -t ${imageName} -f ${tempDockerfilePath} .`);
    execSync(`docker create --name ${containerName} ${imageName}`);
  }

  installTreeSitterGrammar(extension);
  execSync(`docker cp ${filename} ${containerName}:/app/src/file`);
}

function writeTempDockerfile(content: string): string {
  const tempDir = os.tmpdir();
  const tempDockerfilePath = path.join(tempDir, 'Dockerfile');
  fs.writeFileSync(tempDockerfilePath, content);
  return tempDockerfilePath;
}

function containerExists(containerName: string): boolean {
  try {
    execSync(`docker inspect ${containerName}`);
    return true;
  } catch (error) {
    return false;
  }
}

function installTreeSitterGrammar(extension: string) {
  const packageName = `tree-sitter-${extension}`;
  execSync(`docker exec my-node-container npm install ${packageName}`);
}

function runExtractionScript() {
  execSync('docker start -a my-node-container');
  execSync('docker exec my-node-container node bin/getStatements.js -f /app/src/file');
}

function copyModifications(localModsPath: string) {
  execSync(`docker cp ${localModsPath} my-node-container:/app/src/mods`);
}

function runModificationScript() {
  execSync('docker exec my-node-container node bin/modifyStatements.js -f /app/src/file -e /app/src/mods');
}

function copyModifiedFileToLocal(filename: string) {
  const modifiedFilename = 'modified_' + filename;
  execSync(`docker cp my-node-container:/app/src/modified_file ${modifiedFilename}`);
  execSync('docker rm my-node-container');
  fs.writeFileSync(filename, fs.readFileSync(modifiedFilename));
}