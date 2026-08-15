const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando a inserção de 10.000 domínios de SSO para teste de performance...');

  const startTime = Date.now();
  const totalDominios = 10000;
  const tamanhoLote = 500; // Inserção em lotes para otimizar a performance

  for (let i = 0; i < totalDominios; i += tamanhoLote) {
    const loteDominios = [];

    for (let j = 1; j <= tamanhoLote; j++) {
      const indiceAtual = i + j;
      loteDominios.push({
        dominio: `dominio-teste-${indiceAtual}.com`,
        ativo: indiceAtual % 10 !== 0, // Deixa 90% ativos e 10% inativos para testar regras variadas
        tipo: 'DOMINIO', // Ajuste conforme o tipo esperado pelo seu banco (ex: 'DOMINIO', 'EMAIL', etc.)
      });
    }

    // Utiliza createMany para alta performance em massa
    await prisma.ssoRegra.createMany({
      data: loteDominios,
      skipDuplicates: true, // Evita erros caso o script seja executado mais de uma vez
    });

    console.log(`✅ Inseridos ${Math.min(i + tamanhoLote, totalDominios)} / ${totalDominios} domínios SSO...`);
  }

  const endTime = Date.now();
  const duracaoSegundos = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`✨ Sucesso! 10.000 domínios de SSO inseridos em ${duracaoSegundos} segundos.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed de performance SSO:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });