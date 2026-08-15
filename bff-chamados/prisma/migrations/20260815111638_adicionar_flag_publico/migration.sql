-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_procedimentos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "script_passo_a_passo" TEXT NOT NULL,
    "publico" BOOLEAN NOT NULL DEFAULT false,
    "usuario_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "procedimentos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_procedimentos" ("created_at", "descricao", "id", "script_passo_a_passo", "titulo", "updated_at", "usuario_id") SELECT "created_at", "descricao", "id", "script_passo_a_passo", "titulo", "updated_at", "usuario_id" FROM "procedimentos";
DROP TABLE "procedimentos";
ALTER TABLE "new_procedimentos" RENAME TO "procedimentos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
