import { execSync } from "child_process";
import { gitCheck } from "./check_git_cli";
import { getConfig } from "../config";


export async function managePullRequest(branch: string, title: string, body: string) {
  gitCheck();
  const config = getConfig();
  if (!config.git.rootPath) {
    throw 'Missing config.git.rootPath.'
  }

  const prListOutput = JSON.parse(Buffer.from(execSync('gh pr list --state open --base main --json number,headRefName,url', { cwd: config.git.rootPath })).toString()) as { number: number, headRefName: string, url: string }[];

  const existingPr = prListOutput.find(pr => pr.headRefName === branch);
  
  if (!existingPr) {
    execSync(`gh pr create --title "${title}" --body "${body}" --head "${branch}" --base "main"`, { cwd: config.git.rootPath });
  } else {
    execSync(`gh pr review ${existingPr.number} --comment -b "${title}\n\n${body}"`, { cwd: config.git.rootPath }); 
  }

  return `guided edit produced PR ${existingPr?.number} at ${existingPr?.url}`;
}