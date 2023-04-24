import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from "child_process";
import { getFileParser } from '../server/util';

const dockerfile = `FROM node:16\nWORKDIR /app\nRUN npm install tree-sitter`;
const imageName = 'wizapp-image';
const containerName = 'wizapp-container';
const volumeName = 'wizapp-volume';

let activeTasks = 0;

export function processFile(fileName: string) {
  activeTasks++;
  buildAndCopyFile(fileName);
  runExtractionScript();
  const localModsPath = 'path/to/your/local_modifications_file';
  copyModifications(localModsPath);
  runModificationScript();
  copyModifiedFileToLocal(fileName);

  activeTasks--;
  if (!activeTasks) {
    setTimeout(() => {
      if (!activeTasks) stopContainer();
    }, 10000)
  }
}

function stopContainer() {
  execSync(`docker stop ${containerName}`);
}

function buildAndCopyFile(fileName: string) {
  if (!containerExists()) {
    createSharedVolume();
    const tempDockerfilePath = getTempFilePath('Dockerfile', dockerfile);
    execSync(`docker build -t ${imageName} -f ${tempDockerfilePath} .`);
    execSync(`docker create --name ${containerName} -v ${volumeName}:/app/node_modules ${imageName}`);
  } else {
    startContainerIfNotRunning();
  }

  installTreeSitterGrammar(fileName);
  execSync(`docker cp ${fileName} ${containerName}:/app/src/file`);

  // Copy getStatements.js and getStatements.js.map into the Docker container
  const getStatementsPath = path.resolve(__dirname, 'getStatements.js');
  const getStatementsMapPath = path.resolve(__dirname, 'getStatements.js.map');
  execSync(`docker cp ${getStatementsPath} ${containerName}:/app/bin/getStatements.js`);
  execSync(`docker cp ${getStatementsMapPath} ${containerName}:/app/bin/getStatements.js.map`);
  
}

function createSharedVolume() {
  try {
    execSync(`docker volume create ${volumeName}`);
  } catch (error) {
    console.error('Error creating shared volume:', error);
  }
}

function startContainerIfNotRunning() {
  const containerStatus = execSync(`docker inspect --format='{{.State.Status}}' ${containerName}`).toString().trim();
  if (containerStatus !== 'running') {
    execSync(`docker start ${containerName}`);
  }
}

function getTempFilePath(fileName: string, content: string): string {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, fileName);
  fs.writeFileSync(tempFilePath, content);
  return tempFilePath;
}

function containerExists(): boolean {
  try {
    execSync(`docker inspect ${containerName}`);
    return true;
  } catch (error) {
    return false;
  }
}

function installTreeSitterGrammar(fileName: string) {
  const parserName = getFileParser(fileName);
  const packageName = `tree-sitter-${parserName}`;
  execSync(`docker exec ${containerName} npm install ${packageName}`);
}

function runExtractionScript() {
  const result = execSync(`docker exec ${containerName} node bin/getStatements.js`);
  try {
    return JSON.parse(result.toString());
  } catch (error) {
    console.error('Error parsing JSON from extraction script:', error);
    return [];
  }
}

export function copyContentsToDocker(fileName: string, content: string) {
  const tempContentPath = getTempFilePath(fileName, content);
  execSync(`docker cp ${tempContentPath} ${containerName}:/app/${fileName}`)
}

function copyModifications(localModsPath: string) {
  execSync(`docker cp ${localModsPath} ${containerName}:/app/src/mods`);
}

function runModificationScript() {
  execSync(`docker exec ${containerName} node bin/modifyStatements.js -f /app/src/file -e /app/src/mods`);
}

function copyModifiedFileToLocal(fileName: string) {
  const modifiedfileName = 'modified_' + fileName;
  execSync(`docker cp ${containerName}:/app/src/modified_file ${modifiedfileName}`);
  execSync(`docker rm ${containerName}`);
  fs.writeFileSync(fileName, fs.readFileSync(modifiedfileName));
}