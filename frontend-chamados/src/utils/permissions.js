export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export const PERMISSION_LEVELS = {
  EDITAR: 'EDITAR',
  VISUALIZAR: 'VISUALIZAR'
};

export const checkIsAdmin = (role) => {
  if (!role) return false;
  const roleNome = typeof role === 'object' ? role?.nome : role;
  return String(roleNome).toUpperCase() === ROLES.ADMIN;
};

export const checkIsCriador = (idCriador, idUsuarioLogado) => {
  if (!idCriador || !idUsuarioLogado) return false;
  return String(idCriador) === String(idUsuarioLogado);
};

export const checkTemPermissaoEdicaoCompartilhada = (permissoesArray, idUsuarioLogado) => {
  if (!Array.isArray(permissoesArray) || !idUsuarioLogado) return false;
  
  return permissoesArray.some((p) => {
    const idUsuarioPermissao = p?.usuarioId || p?.usuario_id || p?.usuario?.id;
    const nivelPermissao = p?.nivel || p?.permissao;
    
    if (!idUsuarioPermissao || !nivelPermissao) return false;

    const isMesmoUsuario = String(idUsuarioPermissao) === String(idUsuarioLogado);
    const isNivelEdicao = String(nivelPermissao).toUpperCase() === PERMISSION_LEVELS.EDITAR;
    
    return isMesmoUsuario && isNivelEdicao;
  });
};

export const canEditProcedure = (procedimento, usuarioLogado) => {
  if (!procedimento || !usuarioLogado) return false;
  
  if (checkIsAdmin(usuarioLogado.role)) return true;
  
  const idCriador = procedimento.criador_id || procedimento.usuario_id || procedimento.usuario?.id;
  if (checkIsCriador(idCriador, usuarioLogado.id)) return true;

  return checkTemPermissaoEdicaoCompartilhada(procedimento.permissoes, usuarioLogado.id);
};