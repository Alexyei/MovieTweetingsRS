/*
  Warnings:

  - A unique constraint covering the columns `[source,target,type]` on the table `MoviesSimilarity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source,target,type]` on the table `TestMoviesSimilarity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source,target,type]` on the table `TestUsersSimilarity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source,target,type]` on the table `UsersSimilarity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MoviesSimilarity_source_target_key";

-- DropIndex
DROP INDEX "TestMoviesSimilarity_source_target_key";

-- DropIndex
DROP INDEX "TestUsersSimilarity_source_target_key";

-- DropIndex
DROP INDEX "UsersSimilarity_source_target_key";

-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "MoviesSimilarity_source_target_type_key" ON "MoviesSimilarity"("source", "target", "type");

-- CreateIndex
CREATE UNIQUE INDEX "TestMoviesSimilarity_source_target_type_key" ON "TestMoviesSimilarity"("source", "target", "type");

-- CreateIndex
CREATE UNIQUE INDEX "TestUsersSimilarity_source_target_type_key" ON "TestUsersSimilarity"("source", "target", "type");

-- CreateIndex
CREATE UNIQUE INDEX "UsersSimilarity_source_target_type_key" ON "UsersSimilarity"("source", "target", "type");
