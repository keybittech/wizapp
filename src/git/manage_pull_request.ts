import { execSync } from "child_process";
import { gitCheck } from "./check_git_cli";


export async function managePullRequest(branch: string, title: string, body: string) {
  gitCheck();

  const prListOutput = JSON.parse(Buffer.from(execSync('gh pr list --state open --base main --json number,headRefName,url', { cwd: "../../project_diff" })).toString()) as { number: number, headRefName: string, url: string }[];

  const existingPr = prListOutput.find(pr => pr.headRefName === branch);
  
  if (!existingPr) {
    execSync(`gh pr create --title "${title}" --body "${body}" --head "${branch}" --base "main"`, { cwd: '../../project_diff' });
  } else {
    execSync(`gh pr review ${existingPr.number} --comment -b "${title}\n\n${body}"`, { cwd: '../../project_diff' }); 
  }

  return `guided edit produced PR ${existingPr?.number} at ${existingPr?.url}`;
}