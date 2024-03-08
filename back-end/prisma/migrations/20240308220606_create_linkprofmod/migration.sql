/*
  Warnings:

  - The primary key for the `aluno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `matricula` on the `aluno` table. All the data in the column will be lost.
  - The primary key for the `curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `curso` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2)`.
  - You are about to drop the column `duracao` on the `modulo` table. All the data in the column will be lost.
  - You are about to drop the column `is_vip` on the `modulo` table. All the data in the column will be lost.
  - You are about to alter the column `cursoId` on the `modulo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2)`.
  - The primary key for the `professor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `responsavel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `alunoMat` on the `responsavel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matricula]` on the table `responsavel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dur_aula` to the `modulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dur_modulo` to the `modulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profId` to the `modulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matricula` to the `responsavel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "modulo" DROP CONSTRAINT "modulo_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_alunoMat_fkey";

-- DropIndex
DROP INDEX "aluno_userId_key";

-- DropIndex
DROP INDEX "professor_userId_key";

-- DropIndex
DROP INDEX "responsavel_alunoMat_key";

-- DropIndex
DROP INDEX "responsavel_userId_key";

-- AlterTable
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_pkey",
DROP COLUMN "matricula",
ALTER COLUMN "data_nasc" SET DATA TYPE DATE,
ADD CONSTRAINT "aluno_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "curso" DROP CONSTRAINT "curso_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(2),
ADD CONSTRAINT "curso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "modulo" DROP COLUMN "duracao",
DROP COLUMN "is_vip",
ADD COLUMN     "dur_aula" INTEGER NOT NULL,
ADD COLUMN     "dur_modulo" INTEGER NOT NULL,
ADD COLUMN     "profId" INTEGER NOT NULL,
ADD COLUMN     "vip" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "cursoId" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "inicio" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "professor" DROP CONSTRAINT "professor_pkey",
ADD CONSTRAINT "professor_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_pkey",
DROP COLUMN "alunoMat",
ADD COLUMN     "matricula" INTEGER NOT NULL,
ADD CONSTRAINT "responsavel_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "responsavel_matricula_key" ON "responsavel"("matricula");

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_matricula_fkey" FOREIGN KEY ("matricula") REFERENCES "aluno"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
