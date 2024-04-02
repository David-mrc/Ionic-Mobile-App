export interface Movie {
    id: string;
    title: string;
    description: string;
    runningTime: number;
    releaseDate: string;
    image: string;
}

export type Movies = Movie[];
