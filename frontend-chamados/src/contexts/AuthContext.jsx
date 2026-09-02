'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMsal } from '@azure/msal-react';

import api from '../services/api';
import { authService } from '../services/authService';
import { secureStorage } from '../utils/storage';
import { checkIsAdmin } from '../utils/permissions';

const AuthContext = createContext({});

const getBasePath = () => {
  const envPath = process.env.NEXT_PUBLIC_PATH ? process.env.NEXT_PUBLIC_PATH.toLowerCase() : '';
  return envPath ? (envPath.startsWith('/') ? envPath : `/${envPath}`) : '';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { instance } = useMsal();
  
  const basePath = getBasePath();

  useEffect(() => {
    async function carregarSessao() {
      const token = secureStorage.getItem('@chamados:token');
      
      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          
          const data = await authService.obterUsuarioAtual();
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
    const data = await authService.loginCredenciais(email, senha);
    
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
          postLogoutRedirectUri: `${window.location.origin}${basePath}/login`,
          onRedirectNavigate: () => false
        });
        return;
      } catch (error) {
        console.error('Erro no logout MSAL:', error);
      }
    }

    window.location.href = `${basePath}/login`;
  };

  const hasPermission = (permissionKey) => {
    if (!user) return false;
    
    if (checkIsAdmin(user.role)) return true;
    
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