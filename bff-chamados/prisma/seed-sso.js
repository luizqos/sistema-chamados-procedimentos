const { PrismaClient, TipoRegraSso, AcaoRegraSso } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando a inserção de 10.000 regras de SSO para teste de performance...');

  const startTime = Date.now();
  const totalRegistros = 10000;
  const tamanhoLote = 500; // Inserção em lotes para otimizar a performance

  for (let i = 0; i < totalRegistros; i += tamanhoLote) {
    const loteRegras = [];

    for (let j = 1; j <= tamanhoLote; j++) {
      const indiceAtual = i + j;
      loteRegras.push({
        tipo: TipoRegraSso.DOMINIO,
        valor: `dominio-teste-${indiceAtual}.com`,
        acao: indiceAtual % 10 === 0 ? AcaoRegraSso.BLOQUEAR : AcaoRegraSso.PERMITIR, // 90% permitidos, 10% bloqueados
      });
    }

    // Utiliza createMany para alta performance em massa
    await prisma.ssoRegra.createMany({
      data: loteRegras,
      skipDuplicates: true, // Evita erros caso o script seja executado mais de uma vez
    });

    console.log(`✅ Inseridas ${Math.min(i + tamanhoLote, totalRegistros)} / ${totalRegistros} regras de SSO...`);
  }

  const endTime = Date.now();
  const duracaoSegundos = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`✨ Sucesso! 10.000 regras de SSO inseridas em ${duracaoSegundos} segundos.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed de performance SSO:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });