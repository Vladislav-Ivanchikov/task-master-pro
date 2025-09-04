/*
  Warnings:

  - Added the required column `key` to the `TaskFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskFile" ADD COLUMN     "key" TEXT NOT NULL;
