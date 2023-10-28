/*
  Warnings:

  - A unique constraint covering the columns `[authorId,movieId,type]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,movieId,type]` on the table `TestRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_authorId_movieId_type_key" ON "Rating"("authorId", "movieId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "TestRating_authorId_movieId_type_key" ON "TestRating"("authorId", "movieId", "type");
