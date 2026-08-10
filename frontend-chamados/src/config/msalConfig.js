import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MS_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MS_TENANT_ID || 'common'}`,
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'http://localhost:3000/login',
    postLogoutRedirectUri: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'http://localhost:3000/login',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  }
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
  prompt: 'select_account'
};

export const msalInstance = new PublicClientApplication(msalConfig);