import { Octokit } from "octokit";
import { RepositoryRequest } from "./types.interface";

export const fetchDir = async (octokit: Octokit, sha: string) => {
  const data = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner: "pedroacamargo",
      repo: "githubapi",
      tree_sha: sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  console.log("fetchDir", data.data);
  return data.data;
};

export const fetchRepository = async (octokit: Octokit ,path: string = "") => {
  const data = (await octokit.request(
    "GET https://api.github.com/repos/{owner}/{repo}/contents/{path}",
    {
      owner: "pedroacamargo",
      repo: "githubapi",
      path: path,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  )) as RepositoryRequest;
  console.log("fetchRepository", data);

  const res: any = {
    data: await Promise.all(
      data.data.map(async (item) => {
        if (item.type === "dir") {
          const children = (await fetchRepository(octokit, item.path)).data;
          return {
            ...item,
            children,
          };
        }
        return item;
      })
    ),
  };

  return res;
};

export const fetchTreeRecursively = async (octokit: Octokit) =>
  await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1",
    {
      owner: "pedroacamargo",
      repo: "githubapi",
      tree_sha: "6ae8078bb48be972922895eb879bdcdd9c68e8ce",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
