/*
  Warnings:

  - Added the required column `profId` to the `tip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tip" ADD COLUMN     "profId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
