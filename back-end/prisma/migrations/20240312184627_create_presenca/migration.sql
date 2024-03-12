-- CreateTable
CREATE TABLE "presenca" (
    "presencaId" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "presenca_pkey" PRIMARY KEY ("presencaId")
);

-- AddForeignKey
ALTER TABLE "presenca" ADD CONSTRAINT "presenca_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("alunoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presenca" ADD CONSTRAINT "presenca_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
