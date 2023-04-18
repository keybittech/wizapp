import simpleGit from "simple-git";
import { sanitizeName } from "../util";
import { getConfig } from "../config";
import { gitCheck } from "./check_git_cli";

export async function prepareBranch(name: string): Promise<string> {
  gitCheck();
  const config = getConfig();
  if (!config.git.rootPath) {
    throw 'Missing config.git.rootPath.'
  }

  const git = simpleGit(config.git.rootPath);
  const generatedBranch = sanitizeName(`gen/${name}`);

  console.log('Prepare branch checkout.');
  await git.checkout(config.git.source);

  console.log('Pulling main.');
  await git.pull(config.git.remote, generatedBranch);

  console.log('Fetching.');
  await git.fetch('all');

  try {
    console.log('Creating a new branch for ', generatedBranch);
    await git.checkoutBranch(generatedBranch, config.git.source);
    await git.push(config.git.remote, generatedBranch, ['--set-upstream', generatedBranch])
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('A branch named') && err.message.includes('already exists')) {
      console.log('Checking out existing generated branch ', generatedBranch);
      await git.checkout(generatedBranch);
  
      console.log('Pulling generated branch.');
      await git.pull(config.git.remote, generatedBranch);
    }
  }

  return generatedBranch;
}
