import { PublicClientApplication } from '@azure/msal-browser';

const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 
  (typeof window !== 'undefined' ? `${window.location.origin}/login` : 'http://localhost:3000/login');

  console.log('redirectUri>', redirectUri,  'authority >>>', `${process.env.NEXT_PUBLIC_MS_URL}/${process.env.NEXT_PUBLIC_MS_TENANT_ID || 'common'}`);

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MS_CLIENT_ID || '',
    authority: `${process.env.NEXT_PUBLIC_MS_URL}/${process.env.NEXT_PUBLIC_MS_TENANT_ID || 'common'}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
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