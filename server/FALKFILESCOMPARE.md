# Соотнесения файлов между проектом Фалька на Python и моим на JavaScript

| Путь файла в Python-проекте            | Пусть файла в JavaScript-проекте                            |
|----------------------------------------|-------------------------------------------------------------|
| populate_moviegeek.py                  | server/src/seeders/populate_movies.ts                       |
| populate_ratings.py                    | server/src/seeders/populate_ratings.ts                      |
| populate_sample_of_descriptions.py     | server/src/seeders/populate_movies_descriptions.ts          |
| populate_logs.py                       | server/src/seeders/populate_logs.ts                         |
|                                        |                                                             |
| builder/implicit_ratings_calculator.py | server/src/builders/calculate_implicit_ratings.ts           |
| builder/implicit_ratings_calculator.py | server/src/builders/calculate_implicit_ratings_timedecay.ts |
| builder/item_similarity_calculator.py  | server/src/builders/similarity_movies_otiai.ts              |
| *не реализован*                        | server/src/builders/similarity_users_otiai.ts               |
|                                        |                                                             |
| recs/base_recommender.py               | server/src/recommenders/base_recommender.ts                 |
| recs/popularity_recommender.py         | server/src/recommenders/popularity_recommender.ts           |
| recs/neighborhood_based_recommender.py | server/src/recommenders/cf_nb_item_item_recommender.ts      |
| *не реализован*                        | server/src/recommenders/cf_nb_user_user_recommender.ts      |
