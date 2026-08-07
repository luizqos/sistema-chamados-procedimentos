const prisma = require('../config/prisma');

class UsuarioRepository {
  async buscarPorEmail(email) {
    return await prisma.usuario.findUnique({
      where: { email },
    });
  }

  async buscarPorId(id) {
    return await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  async criar(dadosUsuario) {
    return await prisma.usuario.create({
      data: dadosUsuario,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }
}

module.exports = new UsuarioRepository();