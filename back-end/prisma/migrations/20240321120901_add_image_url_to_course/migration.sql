/*
  Warnings:

  - The primary key for the `curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lingua` on the `curso` table. All the data in the column will be lost.
  - The `id` column on the `curso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `nome` to the `curso` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `cursoId` on the `modulo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "modulo" DROP CONSTRAINT "modulo_cursoId_fkey";

-- AlterTable
ALTER TABLE "curso" DROP CONSTRAINT "curso_pkey",
DROP COLUMN "lingua",
ADD COLUMN     "detalhes" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "nome" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "curso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "modulo" DROP COLUMN "cursoId",
ADD COLUMN     "cursoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
