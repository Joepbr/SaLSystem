/*
  Warnings:

  - You are about to drop the `responsavel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_id_fkey";

-- AlterTable
ALTER TABLE "aluno" ADD COLUMN     "resp_email" TEXT,
ADD COLUMN     "resp_nome" TEXT,
ADD COLUMN     "resp_telefone" TEXT;

-- DropTable
DROP TABLE "responsavel";
