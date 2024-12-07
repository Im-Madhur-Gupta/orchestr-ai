const { Octokit } = require("@octokit/rest");
import { Wallet } from "@coinbase/coinbase-sdk";
import { GetGithubRepoContentInput } from "./chatbot";
import { z } from "zod";

const githubToken = ""; // TODO : enter your github token here

const octokit = new Octokit({
    auth: githubToken
})

const path = 'index.html';

export const getDetailsFromRepo = async (wallet: Wallet,
    args: z.infer<typeof GetGithubRepoContentInput>) => {

    const { repo_url } = args;
    const [owner, repo] = repo_url.split('/').slice(-2);
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return { content, sha: response.data.sha };
}

export const updateTitleAndCreatePR = async (baseBranchName, newBranchName, newContent, owner, repo) => {
    const { content, sha } = await getDetailsFromRepo(owner, repo);

    console.log("Content: ", content);

    const updatedContent = newContent;
    const encodedContent = Buffer.from(updatedContent, 'utf-8').toString('base64');

    // Create a new branch
    const { data: refData } = await octokit.request('GET /repos/{owner}/{repo}/git/refs/heads/{branch}', {
        owner,
        repo,
        baseBranchName
    });

    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
        owner,
        repo,
        ref: `refs/heads/${newBranchName}`,
        sha: refData.object.sha
    });

    console.log('New branch created successfully.');


    // Commit the changes to the new branch
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: 'Updated with new SEO in index.html',
        content: encodedContent,
        sha,
        branch: newBranchName
    });

    console.log('Changes Commited Successfully');

    // Create a pull request
    await octokit.request('POST /repos/{owner}/{repo}/pulls', {
        owner,
        repo,
        title: 'Update index.html',
        head: newBranchName,
        base: baseBranchName,
        body: 'This PR updates the SEO of a website'
    });

    console.log('Pull request created successfully.');
}
