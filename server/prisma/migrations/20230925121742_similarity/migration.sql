-- CreateTable
CREATE TABLE "MoviesSimilarity" (
    "id" SERIAL NOT NULL,
    "movieId1" TEXT NOT NULL,
    "movieId2" TEXT NOT NULL,
    "similarity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoviesSimilarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersSimilarity" (
    "id" SERIAL NOT NULL,
    "userId1" INTEGER NOT NULL,
    "userId2" INTEGER NOT NULL,
    "similarity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersSimilarity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MoviesSimilarity_movieId1_movieId2_key" ON "MoviesSimilarity"("movieId1", "movieId2");

-- CreateIndex
CREATE UNIQUE INDEX "UsersSimilarity_userId1_userId2_key" ON "UsersSimilarity"("userId1", "userId2");

-- AddForeignKey
ALTER TABLE "MoviesSimilarity" ADD CONSTRAINT "MoviesSimilarity_movieId1_fkey" FOREIGN KEY ("movieId1") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesSimilarity" ADD CONSTRAINT "MoviesSimilarity_movieId2_fkey" FOREIGN KEY ("movieId2") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSimilarity" ADD CONSTRAINT "UsersSimilarity_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersSimilarity" ADD CONSTRAINT "UsersSimilarity_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
