/*
  Warnings:

  - The values [ADD_TO_LIST] on the enum `TypeEvent` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeEvent_new" AS ENUM ('GENRE_VIEW', 'DETAILS', 'MORE_DETAILS', 'ADD_TO_FAVORITES_LIST', 'REMOVE_FROM_FAVORITES_LIST', 'BUY');
ALTER TABLE "UserEvent" ALTER COLUMN "event" TYPE "TypeEvent_new" USING ("event"::text::"TypeEvent_new");
ALTER TABLE "TestUserEvent" ALTER COLUMN "event" TYPE "TypeEvent_new" USING ("event"::text::"TypeEvent_new");
ALTER TYPE "TypeEvent" RENAME TO "TypeEvent_old";
ALTER TYPE "TypeEvent_new" RENAME TO "TypeEvent";
DROP TYPE "TypeEvent_old";
COMMIT;
