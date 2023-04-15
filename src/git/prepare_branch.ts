import simpleGit from "simple-git";
import { sanitizeName } from "../util";


export async function prepareBranch(name: string): Promise<string> {
  const git = simpleGit('../../project_diff');
  const generatedBranch = sanitizeName(`gen/${name}`);

  console.log('Prepare branch main checkout.');
  await git.checkout('main');
  console.log('Pulling main.');
  await git.pull('origin', 'main');
  console.log('Fetching.');
  await git.fetch('all');

  try {
    console.log('Creating a new branch for ', generatedBranch);
    await git.checkoutBranch(generatedBranch, 'main');
    await git.push('origin', generatedBranch, ['--set-upstream', generatedBranch])
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('A branch named') && err.message.includes('already exists')) {
      console.log('Checking out existing generated branch ', generatedBranch);
      await git.checkout(generatedBranch);
  
      console.log('Pulling generated branch.');
      await git.pull('origin', generatedBranch);
    }
  }

  return generatedBranch;
}
