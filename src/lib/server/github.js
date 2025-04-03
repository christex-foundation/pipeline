//@ts-check
import { GITHUB_TOKEN } from '$lib/server/config';
import axios from 'axios';

/**
 * Retrieves contributors' information from a GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array<{login: string, avatar_url: string, contributions: number, additions: number, deletions: number}>>}
 */
export async function getRepoContributors(owner, repo) {
  try {
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contributors`;
    const response = await axios.get(apiUrl, { headers });

    const contributors = await Promise.all(
      response.data.map(async (contributor) => {
        const statsUrl = `https://api.github.com/repos/${owner}/${repo}/stats/contributors`;
        const statsResponse = await axios.get(statsUrl, { headers });
        const contributorStats = statsResponse.data.find(
          (stat) => stat.author.login === contributor.login,
        );

        let additions = 0;
        let deletions = 0;
        if (contributorStats && contributorStats.weeks) {
          additions = contributorStats.weeks.reduce((sum, week) => sum + week.a, 0);
          deletions = contributorStats.weeks.reduce((sum, week) => sum + week.d, 0);
        }

        return {
          login: contributor.login,
          avatar_url: contributor.avatar_url,
          contributions: contributor.contributions,
          additions,
          deletions,
        };
      }),
    );

    return contributors;
  } catch (error) {
    console.error(`Error retrieving contributors for ${owner}/${repo}:`, error);
    return [];
  }
}

/**
 * Parses a GitHub URL to extract the owner and repository name
 * @param {string} url - GitHub repository URL
 * @returns {{owner: string|null, repo: string|null}}
 */
export function parseGithubUrl(url) {
  const regex = /https:\/\/github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(regex);

  if (match) {
    return { owner: match[1], repo: match[2] };
  } else {
    return { owner: null, repo: null };
  }
}

// Function to interact with GitHub API and fetch file contents
/**
 * Retrieves the content of a file from a GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} filePath - Path to the file
 * @returns {Promise<string|null>} File content or null if not found
 */
async function getFileContent(owner, repo, filePath) {
  try {
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const response = await axios.get(apiUrl, { headers });
    return Buffer.from(response.data.content, 'base64').toString('utf-8');
  } catch (error) {
    return null;
  }
}

// Function to interact with GitHub API and retrieve all markdown (.md) files
/**
 * Retrieves all markdown files from a GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} [path=''] - Path within the repository
 * @param {number} [depth=0] - Maximum recursion depth
 * @returns {Promise<Array<{path: string, content: string|null}>>}
 */
export async function getAllRelevantFiles(owner, repo, path = '', depth = 0) {
  if (depth >= 2) {
    return [];
  }

  try {
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await axios.get(apiUrl, { headers });

    const relevantFiles = [];

    for (const item of response.data) {
      if (item.type === 'file' && (item.name.endsWith('.md') || !item.name.includes('.'))) {
        //console.log('Relevant File:', item.path);
        // If it's a markdown file or a file without extension, retrieve its content
        const fileContent = await getFileContent(owner, repo, item.path);
        relevantFiles.push({ path: item.path, content: fileContent });
      } else if (item.type === 'dir') {
        // If it's a directory, recursively get relevant files
        const filesInDir = await getAllRelevantFiles(owner, repo, item.path, depth + 1);
        relevantFiles.push(...filesInDir);
      }
    }

    return relevantFiles;
  } catch (error) {
    console.error(`Error retrieving relevant files from ${path}:`, error);
    throw new Error('Failed to retrieve relevant files');
  }
}
