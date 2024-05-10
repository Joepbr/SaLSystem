-- CreateTable
CREATE TABLE "tip" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "tip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
