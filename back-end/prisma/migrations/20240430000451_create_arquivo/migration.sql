-- CreateTable
CREATE TABLE "arquivo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "aulaId" INTEGER NOT NULL,

    CONSTRAINT "arquivo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "arquivo" ADD CONSTRAINT "arquivo_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
