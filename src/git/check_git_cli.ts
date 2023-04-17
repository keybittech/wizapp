import { execSync } from "child_process";

export async function checkGitCli() {
  try {
    // Check if the GitHub CLI is installed
    const version = execSync("gh --version").toString();
    console.log(`GitHub CLI installed: ${version}`);

    // Check if the GitHub CLI is properly configured
    const config = execSync("gh config get git_protocol").toString().trim();
    console.log(`GitHub CLI configuration (git_protocol): ${config}`);

    return config === "ssh" || config === "https";
  } catch (error) {
    const err = error as Error;
    console.error("Error:", err.message);
    return false;
  }
}

export function gitCheck() {
  if (!checkGitCli()) throw new Error('github cli is required to be installed and configured in order to use this flow');
}