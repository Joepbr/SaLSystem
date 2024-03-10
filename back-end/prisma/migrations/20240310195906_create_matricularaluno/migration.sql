/*
  Warnings:

  - The primary key for the `aluno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `aluno` table. All the data in the column will be lost.
  - The primary key for the `curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `professor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `professor` table. All the data in the column will be lost.
  - You are about to alter the column `cpf` on the `professor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(11)`.
  - You are about to alter the column `cpf` on the `responsavel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(11)`.
  - Added the required column `matricula` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profId` to the `professor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `end_num` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_userId_fkey";

-- DropForeignKey
ALTER TABLE "modulo" DROP CONSTRAINT "modulo_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "modulo" DROP CONSTRAINT "modulo_profId_fkey";

-- DropForeignKey
ALTER TABLE "professor" DROP CONSTRAINT "professor_userId_fkey";

-- DropForeignKey
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_matricula_fkey";

-- AlterTable
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_pkey",
DROP COLUMN "userId",
ADD COLUMN     "matricula" INTEGER NOT NULL,
ADD CONSTRAINT "aluno_pkey" PRIMARY KEY ("matricula");

-- AlterTable
ALTER TABLE "curso" DROP CONSTRAINT "curso_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "curso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "modulo" ALTER COLUMN "cursoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "professor" DROP CONSTRAINT "professor_pkey",
DROP COLUMN "userId",
ADD COLUMN     "profId" INTEGER NOT NULL,
ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(11),
ADD CONSTRAINT "professor_pkey" PRIMARY KEY ("profId");

-- AlterTable
ALTER TABLE "responsavel" ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(11);

-- AlterTable
ALTER TABLE "user" DROP COLUMN "end_num",
ADD COLUMN     "end_num" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "aula" (
    "id" SERIAL NOT NULL,
    "moduloId" INTEGER NOT NULL,
    "profId" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "conteudo" TEXT,

    CONSTRAINT "aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matricularAluno" (
    "matricula" INTEGER NOT NULL,
    "moduloId" INTEGER NOT NULL,
    "notaFinal" DOUBLE PRECISION,

    CONSTRAINT "matricularAluno_pkey" PRIMARY KEY ("matricula","moduloId")
);

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("profId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_profId_fkey" FOREIGN KEY ("profId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_matricula_fkey" FOREIGN KEY ("matricula") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_matricula_fkey" FOREIGN KEY ("matricula") REFERENCES "aluno"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("profId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricularAluno" ADD CONSTRAINT "matricularAluno_matricula_fkey" FOREIGN KEY ("matricula") REFERENCES "aluno"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricularAluno" ADD CONSTRAINT "matricularAluno_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
