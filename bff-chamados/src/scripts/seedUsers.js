const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

async function main() {
  const [comando, ...args] = process.argv.slice(2);

  switch (comando?.toLowerCase()) {
    case 'add':
      await adicionarUsuario(args);
      break;

    case 'list':
      await listarUsuarios();
      break;

    case 'remove':
      await removerUsuario(args[0]);
      break;

    default:
      exibirAjuda();
      break;
  }
}

async function adicionarUsuario([nome, email, senha, roleInput]) {
  if (!nome || !email || !senha) {
    console.error('\n❌ Parâmetros obrigatórios ausentes.');
    console.log('  Exemplo: node src/scripts/seedUsers.js add "Carlos" carlos@empresa.com "senha123" OPERADOR\n');
    process.exit(1);
  }

  const role = roleInput && roleInput.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'OPERADOR';
  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: { nome, senha: senhaHash, role },
    create: { nome, email, senha: senhaHash, role },
  });

  console.log('\n✅ Usuário salvo com sucesso:');
  console.log(`   ID:    ${usuario.id}`);
  console.log(`   Nome:  ${usuario.nome}`);
  console.log(`   Email: ${usuario.email}`);
  console.log(`   Role:  ${usuario.role}\n`);
}

async function listarUsuarios() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      created_at: true,
    },
    orderBy: { id: 'asc' },
  });

  if (usuarios.length === 0) {
    console.log('\nℹ️ Nenhum usuário encontrado no banco de dados.\n');
    return;
  }

  console.log('\n📋 Usuários Cadastrados:');
  console.table(usuarios);
}

async function removerUsuario(identificador) {
  if (!identificador) {
    console.error('\n❌ Informe o ID ou E-mail do usuário para remover.');
    console.log('  Exemplo: node src/scripts/seedUsers.js remove carlos@empresa.com\n');
    process.exit(1);
  }

  const isId = !isNaN(Number(identificador));
  const where = isId ? { id: Number(identificador) } : { email: identificador };

  try {
    const deletado = await prisma.usuario.delete({ where });
    console.log(`\n🗑️ Usuário "${deletado.email}" (ID: ${deletado.id}) foi removido com sucesso.\n`);
  } catch (error) {
    console.error(`\n❌ Usuário "${identificador}" não foi encontrado.\n`);
  }
}

function exibirAjuda() {
  console.log('\n📌 Uso do Script seedUsers.js:\n');
  console.log('  1. Adicionar/Atualizar usuário:');
  console.log('     node src/scripts/seedUsers.js add "<NOME>" "<EMAIL>" "<SENHA>" [ADMIN|OPERADOR]\n');
  console.log('  2. Listar todos os usuários:');
  console.log('     node src/scripts/seedUsers.js list\n');
  console.log('  3. Remover usuário (por ID ou Email):');
  console.log('     node src/scripts/seedUsers.js remove <EMAIL_OU_ID>\n');
}

main()
  .catch((e) => console.error('❌ Erro no script:', e))
  .finally(async () => await prisma.$disconnect());