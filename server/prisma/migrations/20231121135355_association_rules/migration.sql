-- CreateTable
CREATE TABLE "AssociationRule" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "support" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssociationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAssociationRule" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "support" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestAssociationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssociationRule_source_target_key" ON "AssociationRule"("source", "target");

-- CreateIndex
CREATE UNIQUE INDEX "TestAssociationRule_source_target_key" ON "TestAssociationRule"("source", "target");

-- AddForeignKey
ALTER TABLE "AssociationRule" ADD CONSTRAINT "AssociationRule_source_fkey" FOREIGN KEY ("source") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociationRule" ADD CONSTRAINT "AssociationRule_target_fkey" FOREIGN KEY ("target") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssociationRule" ADD CONSTRAINT "TestAssociationRule_source_fkey" FOREIGN KEY ("source") REFERENCES "TestMovie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssociationRule" ADD CONSTRAINT "TestAssociationRule_target_fkey" FOREIGN KEY ("target") REFERENCES "TestMovie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
