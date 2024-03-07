-- CreateTable
CREATE TABLE "modulo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "horario" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "is_vip" BOOLEAN NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "cursoId" TEXT NOT NULL,

    CONSTRAINT "modulo_pkey" PRIMARY KEY ("id","cursoId")
);

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
