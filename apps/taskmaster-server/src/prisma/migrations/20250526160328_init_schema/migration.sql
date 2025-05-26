/*
  Warnings:

  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT DEFAULT 'https://example.com/default-avatar.png',
ADD COLUMN     "surname" TEXT NOT NULL;
