import { UserT } from "@/types/user.types";

export type PopularityRecsPopsT = {
  predictedRating: number;
  usersCount: number;
  movieId: string;
  purchasesCount: number;
};

export type PopularityRecsBestsellersT = PopularityRecsPopsT & {
  purchasesCount: number;
};

export type CFNBRecsItemItemT = {
  movieId: string;
  predictedRating: number;
  recommendedByMovies: {
    movieId: string;
    similarity: number;
    rating: number;
  }[];
};

export type CFNBRecsUserUserT = {
  movieId: string;
  predictedRating: number;
  recommendedByUsers: { user: UserT; similarity: number; rating: number }[];
};

export type AssociationRuleT = {
  target: string;
  support: number;
  confidence: number;
};
