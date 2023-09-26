/*
  Warnings:

  - Added the required column `type` to the `MoviesSimilarity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `UsersSimilarity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SimilarityType" AS ENUM ('OTIAI', 'COSINE', 'PEARSON');

-- AlterTable
ALTER TABLE "MoviesSimilarity" ADD COLUMN     "type" "SimilarityType" NOT NULL;

-- AlterTable
ALTER TABLE "UsersSimilarity" ADD COLUMN     "type" "SimilarityType" NOT NULL;
