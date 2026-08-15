const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando a inserção de 10.000 usuários fictícios para teste de performance...');

  const startTime = Date.now();
  const senhaHash = await bcrypt.hash('SenhaTeste123!', 10);

  // Busca uma role padrão (ex: OPERADOR ou id 2) para vincular aos usuários gerados
  let roleOperador = await prisma.role.findFirst({ where: { nome: 'OPERADOR' } });
  if (!roleOperador) {
    roleOperador = await prisma.role.findFirst(); // Pega a primeira que encontrar caso não tenha OPERADOR
  }

  const roleId = roleOperador ? roleOperador.id : 1;
  const totalUsuarios = 10000;
  const tamanhoLote = 500; // Inserção em lotes para otimizar memória e performance do banco

  // Domínios fictícios para simular SSO e diferentes provedores de e-mail
  const dominiosSso = ['empresa.com', 'corporativo.net', 'parceiro.org', 'techsolutions.io', 'globalnet.com'];

  for (let i = 0; i < totalUsuarios; i += tamanhoLote) {
    const loteUsuarios = [];

    for (let j = 1; j <= tamanhoLote; j++) {
      const indiceAtual = i + j;
      const dominioEscolhido = dominiosSso[indiceAtual % dominiosSso.length];
      
      loteUsuarios.push({
        nome: `Usuário Teste Performance ${indiceAtual}`,
        email: `usuario.teste.${indiceAtual}@${dominioEscolhido}`,
        senha: senhaHash,
        ativo: true,
        roleId: roleId,
        // Simula ssoId para parte dos usuários para testar o fluxo de SSO
        ssoId: indiceAtual % 2 === 0 ? `sso-guid-ficticio-${indiceAtual}` : null,
      });
    }

    // Utiliza createMany para alta performance de inserção em massa
    await prisma.usuario.createMany({
      data: loteUsuarios,
      skipDuplicates: true, // Evita quebra caso execute o script mais de uma vez
    });

    console.log(`✅ Inseridos ${Math.min(i + tamanhoLote, totalUsuarios)} / ${totalUsuarios} usuários...`);
  }

  const endTime = Date.now();
  const duracaoSegundos = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`✨ Sucesso! 10.000 usuários inseridos em ${duracaoSegundos} segundos.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed de performance:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });