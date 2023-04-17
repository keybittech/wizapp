import simpleGit from "simple-git";
import { sanitizeName } from "../util";
import { getConfig } from "../config";
import { gitCheck } from "./check_git_cli";

export async function pushCommit(path: string, branch: string, msg: string) {
  gitCheck();
  const config = getConfig();
  if (!config.git.rootPath) {
    throw 'Missing config.git.rootPath.'
  }

  const git = simpleGit(config.git.rootPath);

  console.log('Adding ', path, ' to ', branch);
  await git.add(path);

  const commitMsg = sanitizeName(msg).slice(0, 50);
  console.log('Creating commit:', commitMsg);
  await git.commit(commitMsg);

  console.log('Pushing changes to ', branch);
  await git.push('origin', branch);
}
