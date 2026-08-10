'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMsal } from '@azure/msal-react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { instance } = useMsal();

  useEffect(() => {
    async function carregarSessao() {
      const token = localStorage.getItem('@chamados:token');
      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const { data } = await api.get('/api/auth/me');
          setUser(data);
        } catch (error) {
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
    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    setUser(data.usuario);
    router.push('/');
  };

  const loginComToken = (token, usuario) => {
    localStorage.setItem('@chamados:token', token);
    localStorage.setItem('@chamados:user', JSON.stringify(usuario));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(usuario);
    router.push('/');
  };

  const logout = async () => {
    localStorage.removeItem('@chamados:token');
    localStorage.removeItem('@chamados:user');
    delete api.defaults.headers.Authorization;
    setUser(null);

    const accounts = instance.getAllAccounts();
    if (accounts.length > 0) {
      try {
        instance.setActiveAccount(null);

        await instance.logoutRedirect({
          account: accounts[0],
          postLogoutRedirectUri: `${window.location.origin}/login`,
          onRedirectNavigate: () => false
        });
        return;
      } catch (error) {
        console.error('Erro no logout MSAL:', error);
      }
    }

    window.location.href = '/login';
  };

  
  const hasPermission = (permissionKey) => {
    if (!user) return false;
    if (user.role?.nome === 'ADMIN') return true;
    return user.permissoes?.includes(permissionKey) ?? false;
  };

  const hasRole = (roleName) => {
    if (!user) return false;
    return user.role?.nome === roleName;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        loading,
        login,
        loginComToken,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);