import { DAOMixinHelper } from "../../../dao_helper";
import { Prisma, PrismaClient } from "@prisma/client";
import { MovieOrderingT } from "../../../../types/movie.types";
import { DefaultArgs } from "@prisma/client/runtime/library";

class MovieGetDAO__mixin extends DAOMixinHelper {
  async searchMovies(
    searchInput: string,
    yearFrom: number,
    yearTo: number,
    genresIDs: number[],
    ordering: MovieOrderingT,
    take: number,
    skip: number
  ) {
    function getOrdering(ordering: MovieOrderingT) {
      switch (ordering) {
      case "title asc":
          return [{ title: "asc" as "asc" }, { id: "desc" as "desc" }];
        case "title desc":
          return [{ title: "desc" as "desc" }, { id: "desc" as "desc" }];
        case "year asc":
          return [{ year: "asc" as "asc" }, { id: "desc" as "desc" }];
        case "year desc":
          return [{ year: "desc" as "desc" }, { id: "desc" as "desc" }];
      }
    }
    
    const movieIDs = this._testDb
      ? await this._client.testMovie.findMany({
          where: {
            OR: [
              { title: { contains: searchInput, mode: "insensitive" } },
              { description: { contains: searchInput, mode: "insensitive" } },
            ],
            year: { gte: yearFrom, lte: yearTo },
            genres:
              genresIDs.length > 0
                ? { some: { id: { in: genresIDs } } }
                : undefined,
          },
          orderBy: getOrdering(ordering),
          select: {
            id: true,
          },
          skip,
          take,
        })
      : await this._client.movie.findMany({
          where: {
            OR: [
              { title: { contains: searchInput, mode: "insensitive" } },
              { description: { contains: searchInput, mode: "insensitive" } },
            ],
            year: { gte: yearFrom, lte: yearTo },
            genres:
              genresIDs.length > 0
                ? { some: { id: { in: genresIDs } } }
                : undefined,
          },
          orderBy: getOrdering(ordering),
          select: {
            id: true,
          },
          skip,
          take,
        });
    const count = this._testDb
      ? await this._client.testMovie.count({
          where: {
            OR: [
              { title: { contains: searchInput, mode: "insensitive" } },
              { description: { contains: searchInput, mode: "insensitive" } },
            ],
            year: { gte: yearFrom, lte: yearTo },
            genres:
              genresIDs.length > 0
                ? { some: { id: { in: genresIDs } } }
                : undefined,
          },
        })
      : await this._client.movie.count({
          where: {
            OR: [
              { title: { contains: searchInput, mode: "insensitive" } },
              { description: { contains: searchInput, mode: "insensitive" } },
            ],
            year: { gte: yearFrom, lte: yearTo },
            genres:
              genresIDs.length > 0
                ? { some: { id: { in: genresIDs } } }
                : undefined,
          },
        });
    const fullData = await this.getFullMoviesDataByIds(
      movieIDs.map((id) => id.id)
    );
    // console.log(movieIDs)
    // восстанавливаем исходный порядок
    return {
      data: movieIDs.map((movieID) =>
        fullData.find((movie) => movie.id === movieID.id)
      ),
      count,
    };
  }

  async getFullMoviesDataByIds(movieIds: string[]) {
    const averageRatings = await this.getMoviesAverageRatingByIds(movieIds);
    const movieData = await this.getMoviesDataWithGenresByIds(movieIds);

    return movieData.map((movieData) => ({
      ...movieData,
      mean_rating:
        averageRatings.find((ar) => ar.movieId == movieData.id)!._avg.rating ||
        0,
      count_ratings:
        averageRatings.find((ar) => ar.movieId == movieData.id)!._count
          .rating || 0,
    }));
  }

  async getMoviesAverageRatingByIds(movieIds: string[]) {
    if (this._testDb) {
      return this._client.testRating.groupBy({
        by: ["movieId"],
        where: { type: "EXPLICIT", movieId: { in: movieIds } },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });
    }
    return this._client.rating.groupBy({
      by: ["movieId"],
      where: { type: "EXPLICIT", movieId: { in: movieIds } },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
  }

  async getMoviesDataWithGenresByIds(movieIds: string[]) {
    if (this._testDb) {
      return this._client.testMovie.findMany({
        where: { id: { in: movieIds } },
        select: {
          id: true,
          poster_path: true,
          title: true,
          description: true,
          year: true,
          genres: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }
    return this._client.movie.findMany({
      where: { id: { in: movieIds } },
      select: {
        id: true,
        poster_path: true,
        title: true,
        description: true,
        year: true,
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getMovieById(movieId: string) {
    if (this._testDb) {
      return this._client.testMovie.findFirst({
        where: { id: movieId },
        select: { id: true },
      });
    }
    return this._client.movie.findFirst({
      where: { id: movieId },
      select: { id: true },
    });
  }

  // async getMoviesDataByIds(movieIds: string[]) {
  //     if (this._testDb) {
  //         return this._client.testMovie.findMany({
  //             where: {id: {in: movieIds},},
  //             select: {
  //                 id: true,
  //                 poster_path: true,
  //                 title: true,
  //             },
  //         });
  //     }
  //     return this._client.movie.findMany({
  //         where: {id: {in: movieIds},},
  //         select: {
  //             id: true,
  //             poster_path: true,
  //             title: true,
  //         },
  //     });
  // }
}

export function createMovieGetDAOMixin(client: PrismaClient, testDb: boolean) {
  const mixin = new MovieGetDAO__mixin(client, testDb);

  return {
    // 'getMoviesDataByIds': mixin.getMoviesDataByIds.bind(mixin),
    getMovieById: mixin.getMovieById.bind(mixin),
    getFullMoviesDataByIds: mixin.getFullMoviesDataByIds.bind(mixin),
    searchMovies: mixin.searchMovies.bind(mixin),
  };
}
