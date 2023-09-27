-- CreateTable
CREATE TABLE "TestMoviesSimilarity" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "similarity" DOUBLE PRECISION NOT NULL,
    "type" "SimilarityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestMoviesSimilarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestUsersSimilarity" (
    "id" SERIAL NOT NULL,
    "source" INTEGER NOT NULL,
    "target" INTEGER NOT NULL,
    "similarity" DOUBLE PRECISION NOT NULL,
    "type" "SimilarityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestUsersSimilarity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestMoviesSimilarity_source_target_key" ON "TestMoviesSimilarity"("source", "target");

-- CreateIndex
CREATE UNIQUE INDEX "TestUsersSimilarity_source_target_key" ON "TestUsersSimilarity"("source", "target");

-- AddForeignKey
ALTER TABLE "TestMoviesSimilarity" ADD CONSTRAINT "TestMoviesSimilarity_source_fkey" FOREIGN KEY ("source") REFERENCES "TestMovie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestMoviesSimilarity" ADD CONSTRAINT "TestMoviesSimilarity_target_fkey" FOREIGN KEY ("target") REFERENCES "TestMovie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestUsersSimilarity" ADD CONSTRAINT "TestUsersSimilarity_source_fkey" FOREIGN KEY ("source") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestUsersSimilarity" ADD CONSTRAINT "TestUsersSimilarity_target_fkey" FOREIGN KEY ("target") REFERENCES "TestUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
