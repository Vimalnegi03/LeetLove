/*
  Warnings:

  - You are about to drop the column `stout` on the `Submission` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACCEPTED', 'WRONG_ANSWER');

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "stout",
ADD COLUMN     "stdout" TEXT;
