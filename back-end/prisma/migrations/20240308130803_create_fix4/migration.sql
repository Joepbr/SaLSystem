/*
  Warnings:

  - You are about to drop the column `formato` on the `modulo` table. All the data in the column will be lost.
  - Added the required column `presencial` to the `modulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remoto` to the `modulo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modulo" DROP COLUMN "formato",
ADD COLUMN     "presencial" BOOLEAN NOT NULL,
ADD COLUMN     "remoto" BOOLEAN NOT NULL;
