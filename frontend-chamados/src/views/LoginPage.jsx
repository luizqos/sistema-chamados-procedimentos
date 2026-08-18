'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useMsal } from '@azure/msal-react';
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { loginRequest, msalInstance } from '@/src/config/msalConfig';
import BotaoIdiomaLogin from '../components/button/BotaoIdiomaLogin';

import { authService } from '../services/authService';
import { getApiError } from '../utils/errorHandler';

export default function LoginPage() {
  const tAuth = useTranslations('Auth');
  const tToastLogin = useTranslations('Toast.Login');
  const ssoAtivo = process.env.NEXT_PUBLIC_SSO_MICROSOFT_ATIVO === 'true';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [checandoSetup, setChecandoSetup] = useState(true);
  
  const { instance } = useMsal();
  const { login, loginComToken } = useAuth();
  const router = useRouter();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    async function processarSSOERetorno() {
      if (isProcessingRef.current) return;
      
      try {
        await msalInstance.initialize();
        const response = await instance.handleRedirectPromise();
        
        if (response?.idToken) {
          isProcessingRef.current = true;
          setLoading(true);
          window.history.replaceState({}, document.title, window.location.pathname);
          
          const tokenMicrosoft = response.idToken;
          
          const data = await authService.loginSsoMicrosoft(tokenMicrosoft);
          
          if (data?.token && data?.usuario) {
            loginComToken(data.token, data.usuario);
            return;
          }
        }

        const statusData = await authService.verificarSetupStatus();
        
        if (statusData?.precisaSetupInicial) {
          router.push('/setup');
          return;
        }
      } catch (err) {
        console.error('Erro ao processar SSO:', err);
        window.history.replaceState({}, document.title, window.location.pathname);
        
        if (err.message === 'Network Error' || !err.response) {
          toast.error(tToastLogin('erroRede'));
        } else {
          toast.error(getApiError(err, tToastLogin('erroSso')));
        }
      } finally {
        setChecandoSetup(false);
        setLoading(false);
      }
    }
    
    processarSSOERetorno();
  }, [instance, router, loginComToken, tToastLogin]);

  const handleLoginMicrosoft = async () => {
    setLoading(true);
    try {
      await msalInstance.initialize();
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      console.error('Erro ao redirecionar SSO:', err);
      toast.error(tToastLogin('erroConexao'));
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, senha);
    } catch (err) {
      toast.error(getApiError(err, tToastLogin('falhaAutenticacao')));
    } finally {
      setLoading(false);
    }
  };

  if (checandoSetup) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 gap-3">
        <Loader2 size={24} className="animate-spin text-sky-500" />
        <span className="text-xs">{tAuth('verificandoSetup')}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans antialiased relative">
      <BotaoIdiomaLogin />

      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800/80 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">SPC</h2>
            <p className="text-xs text-slate-400">{tAuth('subtituloSistema')}</p>
          </div>
        </div>
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-300 text-xs font-semibold">
            <ShieldCheck size={14} /> {tAuth('ambienteControlado')}
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            {tAuth('bannerTitulo')}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {tAuth('bannerDescricao')}
          </p>
        </div>
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} SPC. Todos os direitos reservados.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-900 lg:bg-slate-950">
        <div className="w-full max-w-md space-y-8 bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{tAuth('autenticacao')}</h2>
            <p className="text-xs text-slate-400 mt-1">{tAuth('informeCredenciais')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{tAuth('emailCorretivo')}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{tAuth('senhaAcesso')}</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl transition duration-150 shadow-lg shadow-sky-600/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>{tAuth('acessar')}</span><ArrowRight size={18} /></>}
            </button>
            {ssoAtivo && (
              <button
                type="button"
                disabled={loading}
                onClick={handleLoginMicrosoft}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>{tAuth('entrarMicrosoft')}</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}