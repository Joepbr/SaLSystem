/*
  Warnings:

  - The primary key for the `aluno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `alunoId` on the `aluno` table. All the data in the column will be lost.
  - The primary key for the `professor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profId` on the `professor` table. All the data in the column will be lost.
  - The primary key for the `responsavel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `responsavel` table. All the data in the column will be lost.
  - Added the required column `id` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `responsavel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "aula" DROP CONSTRAINT "aula_profId_fkey";

-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_profId_fkey";

-- DropForeignKey
ALTER TABLE "matricula" DROP CONSTRAINT "matricula_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "modulo" DROP CONSTRAINT "modulo_profId_fkey";

-- DropForeignKey
ALTER TABLE "presenca" DROP CONSTRAINT "presenca_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "professor" DROP CONSTRAINT "professor_profId_fkey";

-- DropForeignKey
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_userId_fkey";

-- AlterTable
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_pkey",
DROP COLUMN "alunoId",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "aluno_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "professor" DROP CONSTRAINT "professor_pkey",
DROP COLUMN "profId",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "professor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "responsavel_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presenca" ADD CONSTRAINT "presenca_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
