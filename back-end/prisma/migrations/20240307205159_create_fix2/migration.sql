/*
  Warnings:

  - The primary key for the `modulo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `dias_sem` to the `modulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inicio` to the `modulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_estado` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modulo" DROP CONSTRAINT "modulo_pkey",
ADD COLUMN     "dias_sem" TEXT NOT NULL,
ADD COLUMN     "inicio" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "modulo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "end_estado" TEXT NOT NULL;
