import { Posts } from "./post";

export interface Topic {
    id: string;
    name: string;
    posts: Posts
}

export type Topics = Topic[];
