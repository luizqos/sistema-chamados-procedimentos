const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    [, token] = authHeader.split(' ');
  } 
  else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function autorizar(rolesPermitidas = []) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
    }
    return next();
  };
}

function verificarPermissao(permissaoRequerida) {
  return async (req, res, next) => {
    try {
      const usuarioId = req.usuario.id;

      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        include: {
          role: {
            include: {
              permissoes: {
                include: { permissao: true }
              }
            }
          }
        }
      });

      const temPermissao = usuario?.role?.permissoes.some(
        (p) => p.permissao.chave === permissaoRequerida
      );

      if (!temPermissao && usuario?.role?.nome !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado: permissão insuficiente.' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar permissões.' });
    }
  };
}


module.exports = { autenticar, autorizar, verificarPermissao };