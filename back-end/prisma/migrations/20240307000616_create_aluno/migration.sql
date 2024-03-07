-- CreateTable
CREATE TABLE "aluno" (
    "matricula" SERIAL NOT NULL,
    "data_nasc" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("matricula")
);

-- CreateIndex
CREATE UNIQUE INDEX "aluno_userId_key" ON "aluno"("userId");

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
