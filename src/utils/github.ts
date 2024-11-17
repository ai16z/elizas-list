export async function fetchGitHubData(repo: string) {
  const [owner, repoName] = repo.split('/').slice(-2);
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
  return response.json();
} 