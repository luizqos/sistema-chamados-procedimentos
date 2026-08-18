'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { ShieldAlert, User, Mail, Lock, ArrowRight, Loader2, Building2 } from 'lucide-react';

import BotaoIdiomaLogin from '../components/button/BotaoIdiomaLogin';
import { authService } from '../services/authService';
import { getApiError } from '../utils/errorHandler';

export default function SetupPage() {
  const tSetup = useTranslations('Setup');
  const tAuth = useTranslations('Auth');
  const tToastSetup = useTranslations('Toast.Setup');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificandoSetup, setVerificandoSetup] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function checarPermissaoSetup() {
      try {
        const data = await authService.verificarSetupStatus();
        
        if (!data?.precisaSetupInicial) {
          toast.error(tToastSetup('usuarioCadastradoErro'));
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar status de setup:', error);
      } finally {
        setVerificandoSetup(false);
      }
    }
    checarPermissaoSetup();
  }, [router, tToastSetup]);

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.setupInicial({ nome, email, senha });
      
      toast.success(tToastSetup('cadastradoSucesso'));
      router.push('/login');
    } catch (err) {
      toast.error(getApiError(err, tToastSetup('erroConfigInicial')));
    } finally {
      setLoading(false);
    }
  };

  if (verificandoSetup) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 gap-3">
        <Loader2 size={24} className="animate-spin text-sky-500" />
        <span className="text-xs">{tSetup('verificandoPermissao')}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans antialiased relative">
      <BotaoIdiomaLogin />

      {/* Painel Esquerdo - Banner de Setup */}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <ShieldAlert size={14} /> {tSetup('configInicial')}
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            {tSetup('bemVindoSetup')}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {tSetup('descricaoSetup')}
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} SPC. Todos os direitos reservados.
        </div>
      </div>

      {/* Painel Direito - Formulário do Primeiro Admin */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-900 lg:bg-slate-950">
        <div className="w-full max-w-md space-y-8 bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl">
          <div>
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg">
                <Building2 size={20} />
              </div>
              <span className="text-sm font-bold text-white tracking-wider uppercase">SPC Enterprise</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{tSetup('primeiroAcesso')}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {tSetup('preenchaDadosAdmin')}
            </p>
          </div>

          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {tSetup('nomeAdmin')}
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Administrador Geral"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {tAuth('emailCorretivo')}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@empresa.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {tSetup('senhaMaster')}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl transition duration-150 shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{tSetup('criandoAdmin')}</span>
                </>
              ) : (
                <>
                  <span>{tSetup('cadastrar')}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              {tSetup('avisoMaster')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}