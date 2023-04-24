import simpleGit from "simple-git";
import { getConfig } from "../config";
import { gitCheck } from "./check_git_cli";

export async function goHome(): Promise<string> {
  gitCheck();
  const config = getConfig();
  if (!config.git.rootPath) {
    throw 'Missing config.git.rootPath.'
  }

  const git = simpleGit(config.git.rootPath);

  await git.checkout(config.git.source);

  return 'relocated to git root';
}
