import simpleGit from "simple-git";
import { sanitizeName } from "../util";

export async function pushCommit(path: string, branch: string, msg: string) {
  const git = simpleGit('../../project_diff');
  console.log('Adding ', path, ' to ', branch);
  await git.add(path);
  const commitMsg = sanitizeName(msg).slice(0, 50);
  console.log('Creating commit:', commitMsg);
  await git.commit(commitMsg);
  console.log('Pushing changes to ', branch);
  await git.push('origin', branch);
}
