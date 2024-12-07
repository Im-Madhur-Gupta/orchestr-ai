const { Octokit } = require("@octokit/rest");

const githubToken = ""; // TODO : enter your github token here

const octokit = new Octokit({
    auth: githubToken
})

//TODO : Update
const owner = 'AkhileshManda';
const repo = 'Portfolio';
const path = 'index.html';
const branch = 'main';
const newBranch = 'update-title';

const getDetailsFromRepo = async () => {
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

const updateTitleAndCreatePR = async () => {
    const { content, sha } = await getDetailsFromRepo();

    console.log("Content: ", content);

    // Update the title in the HTML content
    const updatedContent = content.replace('Manda', 'UPDATED SURNAME');
    const encodedContent = Buffer.from(updatedContent, 'utf-8').toString('base64');

    // Create a new branch
    const { data: refData } = await octokit.request('GET /repos/{owner}/{repo}/git/refs/heads/{branch}', {
        owner,
        repo,
        branch
    });

    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha: refData.object.sha
    });

    console.log('New branch created successfully.');


    // Commit the changes to the new branch
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message: 'Update title in index.html',
        content: encodedContent,
        sha,
        branch: newBranch
    });

    console.log('Changes Commited Successfully');

    // Create a pull request
    await octokit.request('POST /repos/{owner}/{repo}/pulls', {
        owner,
        repo,
        title: 'Update title in index.html',
        head: newBranch,
        base: branch,
        body: 'This PR updates the title in index.html from "Akhilesh Manda" to "Akhilesh".'
    });

    console.log('Pull request created successfully.');
}

updateTitleAndCreatePR();