export interface Movie {
    id: string;
    title: string;
    description: string;
    runningTime: number;
    releaseDate: Date;
}

export type Movies = Movie[];
