/*
  Warnings:

  - You are about to drop the column `movieId1` on the `MoviesSimilarity` table. All the data in the column will be lost.
  - You are about to drop the column `movieId2` on the `MoviesSimilarity` table. All the data in the column will be lost.
  - You are about to drop the column `userId1` on the `UsersSimilarity` table. All the data in the column will be lost.
  - You are about to drop the column `userId2` on the `UsersSimilarity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[source,target]` on the table `MoviesSimilarity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source,target]` on the table `UsersSimilarity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `source` to the `MoviesSimilarity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target` to the `MoviesSimilarity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `UsersSimilarity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target` to the `UsersSimilarity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MoviesSimilarity" DROP CONSTRAINT "MoviesSimilarity_movieId1_fkey";

-- DropForeignKey
ALTER TABLE "MoviesSimilarity" DROP CONSTRAINT "MoviesSimilarity_movieId2_fkey";

-- DropForeignKey
ALTER TABLE "UsersSimilarity" DROP CONSTRAINT "UsersSimilarity_userId1_fkey";

-- DropForeignKey
ALTER TABLE "UsersSimilarity" DROP CONSTRAINT "UsersSimilarity_userId2_fkey";

-- DropIndex
DROP INDEX "MoviesSimilarity_movieId1_movieId2_key";

-- DropIndex
DROP INDEX "UsersSimilarity_userId1_userId2_key";

-- AlterTable
ALTER TABLE "MoviesSimilarity" DROP COLUMN "movieId1",
DROP COLUMN "movieId2",
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "target" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UsersSimilarity" DROP COLUMN "userId1",
DROP COLUMN "userId2",
ADD COLUMN     "source" INTEGER NOT NULL,
ADD COLUMN     "target" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MoviesSimilarity_source_target_key" ON "MoviesSimilarity"("source", "target");

-- CreateIndex
CREATE UNIQUE INDEX "UsersSimilarity_source_target_key" ON "UsersSimilarity"("source", "target");

-- AddForeignKey
ALTER TABLE "MoviesSimilarity" ADD CONSTRAINT "MoviesSimilarity_source_fkey" FOREIGN KEY ("source") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesSimilarity" ADD CONSTRAINT "MoviesSimilarity_target_fkey" FOREIGN KEY ("target") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSimilarity" ADD CONSTRAINT "UsersSimilarity_source_fkey" FOREIGN KEY ("source") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSimilarity" ADD CONSTRAINT "UsersSimilarity_target_fkey" FOREIGN KEY ("target") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
