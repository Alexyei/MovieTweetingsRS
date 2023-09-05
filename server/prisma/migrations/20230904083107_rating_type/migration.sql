-- CreateEnum
CREATE TYPE "RatingType" AS ENUM ('EXPLICIT', 'IMPLICIT');

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "type" "RatingType" NOT NULL DEFAULT 'EXPLICIT';
