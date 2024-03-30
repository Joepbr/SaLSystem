-- AlterTable
ALTER TABLE "professor" ALTER COLUMN "cpf" DROP NOT NULL;

-- CreateTable
CREATE TABLE "disponibilidade" (
    "id" SERIAL NOT NULL,
    "profId" INTEGER NOT NULL,
    "dia" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disponibilidade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "disponibilidade" ADD CONSTRAINT "disponibilidade_profId_fkey" FOREIGN KEY ("profId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
