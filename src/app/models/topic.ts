import { Posts } from "./post";

export interface Topic {
    id: string;
    name: string;
    posts: Posts;
    owner: string;
    editors: string[];
    readers: string[]
}

export type Topics = Topic[];
