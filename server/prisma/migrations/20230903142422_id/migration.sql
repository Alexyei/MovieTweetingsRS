-- DropForeignKey
ALTER TABLE "UserEvent" DROP CONSTRAINT "UserEvent_genreId_fkey";

-- DropForeignKey
ALTER TABLE "UserEvent" DROP CONSTRAINT "UserEvent_movieId_fkey";

-- AlterTable
ALTER TABLE "UserEvent" ALTER COLUMN "movieId" DROP NOT NULL,
ALTER COLUMN "genreId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
