Допустим у меня есть таблица Rating.
В ней содержатся следующие значения:
```
[
	{id: 1, userId:101, movieId: 1001, rating: 5, type: 'EXPLICIT'}
	{id: 2, userId:101, movieId: 1001, rating: 6, type: 'IMPLICIT'}
	{id: 3, userId:101, movieId: 1002, rating: 7, type: 'IMPLICIT'}
	{id: 4, userId:101, movieId: 1004, rating: 5, type: 'EXPLICIT'}
	{id: 5, userId:102, movieId: 1004, rating: 5, type: 'EXPLICIT'}
	{id: 6, userId:102, movieId: 1004, rating: 6, type: 'IMPLICIT'}
]
```
Как используя node js и prisma ORM получить все оценки пользователей из таблицы, если нужно брать оценку с типом 'EXPLICIT', и только если его нет с типом 'IMPLICIT'.
В результате запрос должен вернуть:
```
[
	{id: 1, userId:101, movieId: 1001, rating: 5, type: 'EXPLICIT'}
	{id: 3, userId:101, movieId: 1002, rating: 7, type: 'IMPLICIT'}
	{id: 4, userId:101, movieId: 1004, rating: 5, type: 'EXPLICIT'}
	{id: 5, userId:102, movieId: 1004, rating: 5, type: 'EXPLICIT'}
]
```