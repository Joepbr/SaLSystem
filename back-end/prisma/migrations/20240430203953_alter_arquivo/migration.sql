/*
  Warnings:

  - Added the required column `type` to the `arquivo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "arquivo" ADD COLUMN     "type" TEXT NOT NULL;
