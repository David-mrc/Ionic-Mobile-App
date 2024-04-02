import { Movies } from "./movie";

export interface MovieList {
    id: string;
    name: string;
    movies: Movies;
    owner: string;
    editors: string[];
    readers: string[]
}

export type MovieLists = MovieList[];
