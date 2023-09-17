/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "TestUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT,

    CONSTRAINT "TestUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestMovie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,
    "poster_path" TEXT,

    CONSTRAINT "TestMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestGenre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TestGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestRating" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "movieId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "type" "RatingType" NOT NULL DEFAULT 'EXPLICIT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestUserEvent" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" TEXT,
    "genreId" INTEGER,
    "event" "TypeEvent" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" INTEGER,

    CONSTRAINT "TestUserEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TestGenreToTestMovie" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TestUser_email_key" ON "TestUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TestGenre_name_key" ON "TestGenre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_TestGenreToTestMovie_AB_unique" ON "_TestGenreToTestMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_TestGenreToTestMovie_B_index" ON "_TestGenreToTestMovie"("B");

-- AddForeignKey
ALTER TABLE "TestRating" ADD CONSTRAINT "TestRating_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRating" ADD CONSTRAINT "TestRating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "TestMovie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestUserEvent" ADD CONSTRAINT "TestUserEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestUserEvent" ADD CONSTRAINT "TestUserEvent_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "TestMovie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestUserEvent" ADD CONSTRAINT "TestUserEvent_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "TestGenre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestGenreToTestMovie" ADD CONSTRAINT "_TestGenreToTestMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "TestGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestGenreToTestMovie" ADD CONSTRAINT "_TestGenreToTestMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "TestMovie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
