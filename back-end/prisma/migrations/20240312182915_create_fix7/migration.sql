/*
  Warnings:

  - The primary key for the `aluno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `matricula` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `matricula` on the `responsavel` table. All the data in the column will be lost.
  - You are about to drop the `matricularAluno` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `professor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[alunoId]` on the table `responsavel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alunoId` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alunoId` to the `responsavel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_matricula_fkey";

-- DropForeignKey
ALTER TABLE "matricularAluno" DROP CONSTRAINT "matricularAluno_matricula_fkey";

-- DropForeignKey
ALTER TABLE "matricularAluno" DROP CONSTRAINT "matricularAluno_moduloId_fkey";

-- DropForeignKey
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_matricula_fkey";

-- DropIndex
DROP INDEX "responsavel_matricula_key";

-- AlterTable
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_pkey",
DROP COLUMN "matricula",
ADD COLUMN     "alunoId" INTEGER NOT NULL,
ADD CONSTRAINT "aluno_pkey" PRIMARY KEY ("alunoId");

-- AlterTable
ALTER TABLE "responsavel" DROP COLUMN "matricula",
ADD COLUMN     "alunoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "matricularAluno";

-- CreateTable
CREATE TABLE "matricula" (
    "MatriculaId" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "moduloId" INTEGER NOT NULL,
    "notaFinal" DOUBLE PRECISION,

    CONSTRAINT "matricula_pkey" PRIMARY KEY ("MatriculaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "professor_cpf_key" ON "professor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "responsavel_alunoId_key" ON "responsavel"("alunoId");

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("alunoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("alunoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
