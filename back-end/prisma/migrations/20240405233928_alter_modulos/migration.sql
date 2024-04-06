/*
  Warnings:

  - Added the required column `horario` to the `modulo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modulo" ADD COLUMN     "horario" TEXT NOT NULL;
