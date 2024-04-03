/*
  Warnings:

  - You are about to drop the column `dias_sem` on the `modulo` table. All the data in the column will be lost.
  - You are about to drop the column `horario` on the `modulo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "modulo" DROP COLUMN "dias_sem",
DROP COLUMN "horario";

-- CreateTable
CREATE TABLE "dias_sem" (
    "id" SERIAL NOT NULL,
    "dia" TEXT NOT NULL,
    "moduloId" INTEGER NOT NULL,

    CONSTRAINT "dias_sem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dias_sem" ADD CONSTRAINT "dias_sem_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
