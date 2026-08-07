const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function buscarOuCriarRole(nome) {
  let role = await prisma.role.findUnique({
    where: { nome },
  });

  if (!role) {
    role = await prisma.role.create({
      data: { nome },
    });
    console.log(`➕ Role '${nome}' criada com ID ${role.id}`);
  }

  return role;
}

async function criarAdmin({ nome, email, senha }) {
  const role = await buscarOuCriarRole('ADMIN');
  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: {
      nome,
      roleId: role.id,
      senha: senhaHash,
    },
    create: {
      nome,
      email,
      senha: senhaHash,
      roleId: role.id,
    },
    include: {
      role: true,
    },
  });

  console.log(`✅ Usuário '${usuario.nome}' (${usuario.email}) salvo como ADMIN.`);
}

async function listarUsuarios() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      ssoId: true,
      created_at: true,
      role: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });

  console.log('\n📋 Lista de Usuários Cadastrados:');
  console.table(
    usuarios.map((u) => ({
      ID: u.id,
      Nome: u.nome,
      Email: u.email,
      Perfil: u.role ? u.role.nome : 'Sem Role',
      CriadoEm: u.created_at.toISOString(),
    }))
  );
}

async function main() {
  const args = process.argv.slice(2);
  const comando = args[0];

  if (comando === 'list') {
    await listarUsuarios();
    return;
  }

  const [nome, email, senha] = args;

  if (!nome || !email || !senha) {
    console.error('\n❌ Erro: Parâmetros insuficientes.');
    console.log('\nModo de uso:');
    console.log('  node src/scripts/seedUsers.js <NOME> <EMAIL> <SENHA>');
    console.log('  node src/scripts/seedUsers.js list');
    console.log('\nExemplo:');
    console.log('  node src/scripts/seedUsers.js "Luiz Silva" admin@empresa.com "SenhaForte123!"\n');
    process.exit(1);
  }

  console.log('🌱 Criando/atualizando usuário Administrador...');
  await criarAdmin({ nome, email, senha });

  console.log('\n--- Status final ---');
  await listarUsuarios();
}

main()
  .catch((e) => {
    console.error('❌ Erro no script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });