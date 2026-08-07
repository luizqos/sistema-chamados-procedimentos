'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function carregarSessao() {
      const token = localStorage.getItem('@chamados:token');

      if (token) {
        try {
          // Valida o token e busca os dados atualizados do usuário no BFF
          const { data } = await api.get('/api/auth/me');
          setUser(data);
        } catch (error) {
          // Se o token expirou ou é inválido, limpa a sessão
          localStorage.removeItem('@chamados:token');
          localStorage.removeItem('@chamados:user');
          setUser(null);
        }
      }
      setLoading(false);
    }

    carregarSessao();
  }, []);

  const login = async (email, senha) => {
    const { data } = await api.post('/api/auth/login', { email, senha });

    localStorage.setItem('@chamados:token', data.token);
    localStorage.setItem('@chamados:user', JSON.stringify(data.usuario));

    setUser(data.usuario);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('@chamados:token');
    localStorage.removeItem('@chamados:user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);