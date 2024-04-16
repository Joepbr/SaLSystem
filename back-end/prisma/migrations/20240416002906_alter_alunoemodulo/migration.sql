-- AlterTable
ALTER TABLE "aluno" ADD COLUMN     "resp_data_nasc" TIMESTAMP(3),
ADD COLUMN     "resp_parent" TEXT;

-- AlterTable
ALTER TABLE "modulo" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
