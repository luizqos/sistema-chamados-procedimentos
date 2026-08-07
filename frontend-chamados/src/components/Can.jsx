'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Renderiza os filhos apenas se o usuário tiver a Role ou a Permissão informada.
 *
 * @param {Object} props
 * @param {string} [props.permission] - Chave da permissão (ex: 'procedimentos:criar')
 * @param {string} [props.role] - Nome do perfil (ex: 'ADMIN')
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.fallback=null] - O que exibir caso não tenha permissão
 */
export function Can({ permission, role, children, fallback = null }) {
  const { hasPermission, hasRole } = useAuth();

  if (role && !hasRole(role)) {
    return fallback;
  }

  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  return children;
}