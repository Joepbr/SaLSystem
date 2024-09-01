-- AlterTable
ALTER TABLE "avaliacao" ADD COLUMN     "recup" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "passwordReset" BOOLEAN NOT NULL DEFAULT true;
