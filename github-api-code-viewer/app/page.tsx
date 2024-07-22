"use client";
import { Octokit } from "octokit";
import { useEffect, useState } from "react";
import { RepositoryRequest } from "./types.interface";

export default function Home() {
  const [repo, setRepo] = useState<RepositoryRequest>({
    data: [],
  });

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  useEffect(() => {
    const fetchRepo = async () => {
      const data = (await octokit.request(
        "GET https://api.github.com/repos/carlosd035/rest-api/contents/",
        {
          owner: "OWNER",
          repo: "REPO",
          tree_sha: "TREE_SHA",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      )) as RepositoryRequest;
      setRepo(data);
    };
    fetchRepo();
  }, []);

  console.log(repo.data);

  return (
    <div className="bg-black w-full h-screen pt-12">
      <div className="flex flex-col border-l-2 border-l-white pl-[20px] pt-[30px] ml-12 gap-4 relative">
        <div className="w-[10px] h-[10px] bg-white absolute -left-[5px] -top-[5px]"></div>
        {
          repo.data.map((item) => (
            <div key={item.name} className="text-white relative">
              <div className="w-[10px] h-[1px] top-1/2 -left-[20px] bg-white absolute"></div>
              {item.name}
            </div>
          ))
        }
      </div>
    </div>
  );
}
