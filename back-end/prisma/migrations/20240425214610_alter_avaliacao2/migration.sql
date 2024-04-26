/*
  Warnings:

  - You are about to drop the column `is_prova` on the `avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `professor` table. All the data in the column will be lost.
  - Added the required column `titulo` to the `avaliacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "professor_cpf_key";

-- AlterTable
ALTER TABLE "avaliacao" DROP COLUMN "is_prova",
ADD COLUMN     "titulo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "professor" DROP COLUMN "cpf";
