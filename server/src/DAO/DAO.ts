import getMoviesSimilarityDAO from "./tables/moviesSimilarity/movie_similarity_dao";
import { PrismaClient } from "@prisma/client";
import getMovieDAO from "./tables/movie/movie_dao";
import getUserDAO from "./tables/user/user_dao";
import getRatingDAO from "./tables/rating/rating_dao";
import getPriorityRatingDAO from "./tables/priorityRating/priority_rating_dao";
import getUserSimilarityDAO from "./tables/usersSimilarity/user_similarity_dao";
import getUserEventDAO from "./tables/userEvent/user_event_dao";
import getGenreDAO from "./tables/genre/genre_dao";
import getAssociationRuleDAO from "./tables/associationRules/association_rules_dao";

class DAO {
  _testDb: boolean;
  _client = new PrismaClient();
  readonly #movieSimilarity: ReturnType<typeof getMoviesSimilarityDAO>;
  readonly #userSimilarity: ReturnType<typeof getUserSimilarityDAO>;
  readonly #associationRule: ReturnType<typeof getAssociationRuleDAO>;
  readonly #movie: ReturnType<typeof getMovieDAO>;
  readonly #user: ReturnType<typeof getUserDAO>;
  readonly #rating: ReturnType<typeof getRatingDAO>;
  readonly #priorityRating: ReturnType<typeof getPriorityRatingDAO>;
  readonly #userEvent: ReturnType<typeof getUserEventDAO>;
  readonly #genre: ReturnType<typeof getGenreDAO>;

  constructor(testDb: boolean) {
    this._testDb = testDb;
    this.#movieSimilarity = getMoviesSimilarityDAO(this._client, this._testDb);
    this.#userSimilarity = getUserSimilarityDAO(this._client, this._testDb);
    this.#associationRule = getAssociationRuleDAO(this._client, this._testDb);
    this.#movie = getMovieDAO(this._client, this._testDb);
    this.#user = getUserDAO(this._client, this._testDb);
    this.#rating = getRatingDAO(this._client, this._testDb);
    this.#priorityRating = getPriorityRatingDAO(this._client, this._testDb);
    this.#userEvent = getUserEventDAO(this._client, this._testDb);
    this.#genre = getGenreDAO(this._client, this._testDb);
  }

  get movieSimilarity() {
    return this.#movieSimilarity;
  }

  get userSimilarity() {
    return this.#userSimilarity;
  }

  get associationRule() {
    return this.#associationRule;
  }

  get movie() {
    return this.#movie;
  }

  get user() {
    return this.#user;
  }

  get rating() {
    return this.#rating;
  }

  get priorityRating() {
    return this.#priorityRating;
  }

  get userEvent() {
    return this.#userEvent;
  }

  get genre() {
    return this.#genre;
  }
}

let testDAOInstance: DAO | null = null;
let realDAOInstance: DAO | null = null;

export function getDAO(testDB: boolean) {
  if (testDB) {
    if (testDAOInstance) return testDAOInstance;
    testDAOInstance = new DAO(true);
    return testDAOInstance;
  }

  if (realDAOInstance) return realDAOInstance;
  realDAOInstance = new DAO(false);
  return realDAOInstance;
}
