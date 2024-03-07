/*
  Warnings:

  - You are about to drop the column `nome` on the `curso` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `user` table. All the data in the column will be lost.
  - Added the required column `lingua` to the `curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_cid` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_logr` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_num` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "curso" DROP COLUMN "nome",
ADD COLUMN     "lingua" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "curso_id_seq";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "fullname",
ADD COLUMN     "end_cid" TEXT NOT NULL,
ADD COLUMN     "end_compl" TEXT,
ADD COLUMN     "end_logr" TEXT NOT NULL,
ADD COLUMN     "end_num" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL;
