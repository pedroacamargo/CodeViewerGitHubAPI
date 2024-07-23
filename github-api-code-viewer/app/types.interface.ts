export interface RepositoryRequest {
    data : {
        name: string;
        sha: string;
        size: number;
        type: "dir" | "file";
        path: string;
        url: string;
        children?: RepositoryRequest[];
    }[]
}

export interface Content {
    name: string;
    sha: string;
    size: number;
    type: "dir" | "file";
    path: string;
    url: string;
    children?: Content[];
}