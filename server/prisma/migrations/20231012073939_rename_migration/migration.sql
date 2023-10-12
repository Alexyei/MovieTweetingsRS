/*
  Warnings:

  - You are about to drop the column `name` on the `TestUser` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestUser" RENAME COLUMN "name" TO "login";

-- AlterTable
ALTER TABLE "User" RENAME COLUMN "name" TO "login"
