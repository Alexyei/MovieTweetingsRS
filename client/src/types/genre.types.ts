export type GenreT = {
    id: number,
    name: string,
    moviesCount: number,
}

export type UserRatingsDataByGenresT = {
    globalUser: {
        explicit: {
            userAvg: number, userCount: number,
        },
        implicit: {
            userAvg: number, userCount: number,
        }
    }
    genresData: {
        id: number, name: string,
        explicit: { allAvg: number, allCount: number, userAvg: number, userCount: number },
        implicit: { allAvg: number, allCount: number, userAvg: number, userCount: number },
    }[]
}

export type UserRatingsDataByGenresExtendedT = {
    globalUser: {
        explicit: {
            userAvg: number, userCount: number,
        },
        implicit: {
            userAvg: number, userCount: number,
        }
    }
    genresData: {
        id: number, name: string,
        explicit: {
            allAvg: number,
            allCount: number,
            userAvg: number,
            userCount: number,
            userDifAvg: number,
            userDifAvgNorm: number,
            allDifAvg: number,
            allDifAvgNorm: number,
            userCountNorm: number
        },
        implicit: {
            allAvg: number,
            allCount: number,
            userAvg: number,
            userCount: number,
            userDifAvg: number,
            userDifAvgNorm: number,
            allDifAvg: number,
            allDifAvgNorm: number,
            userCountNorm: number
        },
    }[]
}

export type UserRatingsDataByGenresShortT = {
    globalUser: {
        userAvg: number, userCount: number,
    }
    genresData: {
        id: number,
        name: string,
        allAvg: number,
        allCount: number,
        userAvg: number,
        userCount: number,
        userDifAvg: number,
        userDifAvgNorm: number,
        allDifAvg: number,
        allDifAvgNorm: number,
        userCountNorm: number
    }[],
}
