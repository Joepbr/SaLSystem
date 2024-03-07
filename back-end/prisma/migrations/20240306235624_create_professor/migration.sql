/*
  Warnings:

  - The primary key for the `curso` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "curso" DROP CONSTRAINT "curso_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "curso_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "professor" (
    "cpf" INTEGER NOT NULL,
    "formacao" TEXT,
    "slario" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "professor_pkey" PRIMARY KEY ("cpf")
);

-- CreateIndex
CREATE UNIQUE INDEX "professor_userId_key" ON "professor"("userId");

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
