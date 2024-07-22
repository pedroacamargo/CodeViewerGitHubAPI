export interface RepositoryRequest {
    data : {
        name: string;
        sha: string;
        size: number;
        type: string;
        path: string;
        url: string;
    }[]
}