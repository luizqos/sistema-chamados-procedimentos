-- CreateTable
CREATE TABLE "ProcedimentoPermissao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "procedimentoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nivel" TEXT NOT NULL,
    CONSTRAINT "ProcedimentoPermissao_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "procedimentos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcedimentoPermissao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcedimentoPermissao_procedimentoId_usuarioId_key" ON "ProcedimentoPermissao"("procedimentoId", "usuarioId");
