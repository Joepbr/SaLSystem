/*
  Warnings:

  - You are about to drop the column `alunoId` on the `avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `nota` on the `avaliacao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_alunoId_fkey";

-- AlterTable
ALTER TABLE "avaliacao" DROP COLUMN "alunoId",
DROP COLUMN "nota";

-- CreateTable
CREATE TABLE "notas" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "avaliacaoId" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "notas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notas" ADD CONSTRAINT "notas_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas" ADD CONSTRAINT "notas_avaliacaoId_fkey" FOREIGN KEY ("avaliacaoId") REFERENCES "avaliacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
