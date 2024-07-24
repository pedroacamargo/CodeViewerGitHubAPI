"use client";
import { Octokit } from "octokit";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Content, RepositoryRequest } from "./types.interface";
import { fetchContent, fetchDir, fetchRepository } from "./funcs";

const TreeNode = ({ item, setContent }: { item: Content, setContent: Dispatch<SetStateAction<Content>> }) => {
  const treeDepth = item.path.split("/").length - 1;
  if (item.type === "file") {
    return (
      <div key={item.name} className="text-white relative cursor-pointer hover:text-blue-600" style={{
        marginLeft: `${(treeDepth) * 10}px`
      }}
      onClick={() => {
        setContent(item);
      }}>
        <div className=" h-[1px] top-1/2 -left-[20px] bg-white absolute" ></div>
        {item.name}
      </div>
    );
  }
  // console.log(treeDepth)
  return (
    <div className={`text-white relative`} style={{
      marginLeft: `${treeDepth * 10}px`
    }}>
      {item.name}
      <div>
        {item.children?.map((child) => (
          <TreeNode setContent={setContent} key={child.name} item={child} />
        ))}
      </div>
    </div>
  );
};


export default function Home() {
  const [content, setContent] = useState<Content>({} as Content);
  const [selectedContent, setSelectedContent] = useState<any[]>([]);
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
      setRepo({ data });
    };
    fetchRepo();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (!content.path) return;

      const data = await fetchContent(octokit, content.path);

      console.log(data);
      console.log(atob(data.content));

      const final = atob(data.content).split("\n");

      // console.log(final);

      setSelectedContent(final);
    };
    fetch();
  }, [content]);

  return (
    <div className="bg-black w-full min-h-screen pt-12">
      <div className="flex flex-col border-l-2 border-l-white pl-[20px] pt-[10px] ml-12 gap-1 relative">
        <div className="w-[10px] h-[10px] bg-white absolute -left-[5px] -top-[5px]"></div>
        {repo.data.map((item) => {
          return <TreeNode setContent={setContent} key={item.name} item={item} />;
        })}
      </div>
      <div className="max-w-screen text-white mt-12 p-12">
        {
          content.type === "file" && selectedContent.length > 0 ? (
            <div className="w-full">
              <h1 className="text-2xl text-white">{content.name}</h1>
              <div className="text-white whitespace-pre-wrap break-words">
                {selectedContent.map((item: string, index: number) => (
                  <div key={index} className="flex break-words">
                    <div className="mr-2">{index}: </div>
                    <div className="break-words w-full">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  );
}
