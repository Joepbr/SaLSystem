/*
  Warnings:

  - The primary key for the `responsavel` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "responsavel" DROP CONSTRAINT "responsavel_pkey",
ALTER COLUMN "cpf" SET DATA TYPE TEXT,
ADD CONSTRAINT "responsavel_pkey" PRIMARY KEY ("cpf");
