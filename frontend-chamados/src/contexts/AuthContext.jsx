'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMsal } from '@azure/msal-react';
import api from '../services/api';
import { secureStorage } from '../utils/storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { instance } = useMsal();

  useEffect(() => {
    async function carregarSessao() {
      const token = secureStorage.getItem('@chamados:token');
      
      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          // TODO: passar para service
          const { data } = await api.get('/api/auth/me');
          setUser(data);
        } catch (error) {
          secureStorage.removeItem('@chamados:token');
          secureStorage.removeItem('@chamados:user');
          setUser(null);
        }
      }
      setLoading(false);
    }
    carregarSessao();
  }, []);

  const login = async (email, senha) => {
    // TODO: PASSAR PARA SERVICE
    const { data } = await api.post('/api/auth/login', { email, senha });
    
    secureStorage.setItem('@chamados:token', data.token);
    secureStorage.setItem('@chamados:user', data.usuario);

    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    setUser(data.usuario);
    router.push('/');
  };

  const loginComToken = (token, usuario) => {
    secureStorage.setItem('@chamados:token', token);
    secureStorage.setItem('@chamados:user', usuario);

    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(usuario);
    router.push('/');
  };

  const logout = async () => {
    secureStorage.removeItem('@chamados:token');
    secureStorage.removeItem('@chamados:user');

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