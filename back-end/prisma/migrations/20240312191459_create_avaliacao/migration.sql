/*
  Warnings:

  - The primary key for the `matricula` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `MatriculaId` on the `matricula` table. All the data in the column will be lost.
  - The primary key for the `presenca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `presencaId` on the `presenca` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "matricula" DROP CONSTRAINT "matricula_pkey",
DROP COLUMN "MatriculaId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "matricula_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "presenca" DROP CONSTRAINT "presenca_pkey",
DROP COLUMN "presencaId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "presenca_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "avaliacao" (
    "id" SERIAL NOT NULL,
    "profId" INTEGER NOT NULL,
    "moduloId" INTEGER NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "is_prova" BOOLEAN NOT NULL,
    "nota" DOUBLE PRECISION,

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("profId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("alunoId") ON DELETE RESTRICT ON UPDATE CASCADE;
