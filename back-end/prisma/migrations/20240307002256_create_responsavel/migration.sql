/*
  Warnings:

  - You are about to drop the column `slario` on the `professor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "professor" DROP COLUMN "slario",
ADD COLUMN     "salario" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "responsavel" (
    "cpf" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "alunoMat" INTEGER NOT NULL,

    CONSTRAINT "responsavel_pkey" PRIMARY KEY ("cpf")
);

-- CreateIndex
CREATE UNIQUE INDEX "responsavel_userId_key" ON "responsavel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "responsavel_alunoMat_key" ON "responsavel"("alunoMat");

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_alunoMat_fkey" FOREIGN KEY ("alunoMat") REFERENCES "aluno"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;
