const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Criando Roles no banco de dados...');

  const roles = ['ADMIN', 'OPERADOR'];

  for (const nome of roles) {
    const role = await prisma.role.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
    console.log(`  └─ Role "${role.nome}" (ID: ${role.id}) pronta.`);
  }

  console.log('✅ Roles criadas com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed de roles:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });