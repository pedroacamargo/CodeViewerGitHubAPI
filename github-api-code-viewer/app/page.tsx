"use client";
import { Octokit } from "octokit";
import { useEffect, useState } from "react";
import { Content, RepositoryRequest } from "./types.interface";
import { fetchDir, fetchRepository } from "./funcs";

const TreeNode = ({ item }: { item: Content }) => {
  const treeDepth = item.path.split("/").length - 1;
  if (item.type === "file") {
    return (
      <div key={item.name} className="text-white relative" style={{
        marginLeft: `${(treeDepth) * 10}px`
      }}>
        <div className=" h-[1px] top-1/2 -left-[20px] bg-white absolute" ></div>
        {item.name}
      </div>
    );
  }
  console.log(treeDepth)
  return (
    <div className={`text-white relative`} style={{
      marginLeft: `${treeDepth * 10}px`
    }}>
      {item.name}
      <div>
        {item.children?.map((child) => (
          <TreeNode key={child.name} item={child} />
        ))}
      </div>
    </div>
  );
};


export default function Home() {
  const [repo, setRepo] = useState<{
    data: Content[];
  }>({
    data: [],
  });

  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  });
  
  
  useEffect(() => {
    const fetchRepo = async () => {
      console.log("fetchRepo");

      const { data } = await fetchRepository(octokit);

      console.log(data);

      // const res = {
      //   data: await Promise.all(
      //     data.map(async (item: Content) => {
      //       if (item.type === "dir") {
      //         const children = (await fetchRepository(item.path)).data;
      //         return {
      //           ...item,
      //           children,
      //         };
      //       }
      //       return item;
      //     }),
      //   ) as Content[],
      // };

      console.log(data);
      setRepo({ data });
    };
    fetchRepo();
  }, []);

  console.log(repo.data);

  return (
    <div className="bg-black w-full h-screen pt-12">
      <div className="flex flex-col border-l-2 border-l-white pl-[20px] pt-[10px] ml-12 gap-1 relative">
        <div className="w-[10px] h-[10px] bg-white absolute -left-[5px] -top-[5px]"></div>
        {repo.data.map((item) => {
          if (item.type === "file") {
            return (
              <div key={item.name} className="text-white relative">
                <div className="w-[10px] h-[1px] top-1/2 -left-[20px] bg-white absolute"></div>
                {item.name}
              </div>
            );
          }
          return <TreeNode key={item.name} item={item} />;
        })}
      </div>
    </div>
  );
}
