/*
  Warnings:

  - You are about to drop the column `formacao` on the `professor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "professor" DROP COLUMN "formacao",
ADD COLUMN     "especialidade" TEXT,
ADD COLUMN     "imageUrl" TEXT;
