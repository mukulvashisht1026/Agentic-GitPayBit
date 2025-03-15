import { tool } from "@langchain/core/tools";
import { z } from "zod";

interface GitHubProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

interface GitHubFollower {
  login: string;
  html_url: string;
  avatar_url: string;
}

const githubProfileLookupTool = tool(
  async ({
    username,
    includeRepos = false,
    includeFollowers = false,
  }: {
    username: string;
    includeRepos?: boolean;
    includeFollowers?: boolean;
  }) => {
    console.log(`Fetching GitHub profile for ${username}`);

    const apiUrl = `https://api.github.com/users/${username}`;
    const reposUrl = `https://api.github.com/users/${username}/repos`;
    const followersUrl = `https://api.github.com/users/${username}/followers`;

    try {
      const profileResponse = await fetch(apiUrl);
      if (!profileResponse.ok) {
        throw new Error(`GitHub API request failed with status ${profileResponse.status}`);
      }
      const profileData: GitHubProfile = await profileResponse.json();

      let additionalData: {
        repos?: GitHubRepo[];
        followers?: GitHubFollower[];
      } = {};

      if (includeRepos) {
        const reposResponse = await fetch(reposUrl);
        if (reposResponse.ok) {
          const reposData: GitHubRepo[] = await reposResponse.json();
          additionalData.repos = reposData.map((repo) => ({
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language,
          }));
        }
      }

      if (includeFollowers) {
        const followersResponse = await fetch(followersUrl);
        if (followersResponse.ok) {
          const followersData: GitHubFollower[] = await followersResponse.json();
          additionalData.followers = followersData.map((follower) => ({
            login: follower.login,
            html_url: follower.html_url,
            avatar_url: follower.avatar_url,
          }));
        }
      }

      return JSON.stringify({ profile: profileData, ...additionalData });
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      return JSON.stringify({ error: "Failed to fetch GitHub data." });
    }
  },
  {
    name: "github_profile_lookup",
    description: "Fetches a user's GitHub profile, repositories, and followers based on user preference.",
    schema: z.object({
      username: z.string().describe("The GitHub username to look up"),
      includeRepos: z.boolean().optional().default(false).describe("Whether to include user repositories"),
      includeFollowers: z.boolean().optional().default(false).describe("Whether to include user followers"),
    }),
  }
);

export default githubProfileLookupTool;