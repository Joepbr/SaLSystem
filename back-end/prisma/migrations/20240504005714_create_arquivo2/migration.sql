-- CreateTable
CREATE TABLE "arquivo2" (
    "nome" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "id" INTEGER NOT NULL,

    CONSTRAINT "arquivo2_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "arquivo2" ADD CONSTRAINT "arquivo2_id_fkey" FOREIGN KEY ("id") REFERENCES "notas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
