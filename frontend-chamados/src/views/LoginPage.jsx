'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [checandoSetup, setChecandoSetup] = useState(true);
  
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function checarPrimeiroAcesso() {
      try {
        const { data } = await api.get('/api/auth/setup-status');
        if (data?.precisaSetupInicial) {
          router.push('/setup');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar status de setup inicial:', error);
      } finally {
        setChecandoSetup(false);
      }
    }
    checarPrimeiroAcesso();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, senha);
      toast.success('Autenticado com sucesso.');
    } catch (err) {
      const mensagem = err.response?.data?.error || 'Falha na autenticação. Verifique suas credenciais.';
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  };

  // Tela de transição enquanto valida o banco de dados
  if (checandoSetup) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 gap-3">
        <Loader2 size={24} className="animate-spin text-sky-500" />
        <span className="text-xs">Verificando inicialização do sistema...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Painel Esquerdo - Banner Institucional Corporativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800/80 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">SCP Enterprise</h2>
            <p className="text-xs text-slate-400">Sistema de Chamados & Procedimentos</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-300 text-xs font-semibold">
            <ShieldCheck size={14} /> Ambiente Controlado
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Base do Conhecimento Operacional & Procedimentos Técnicos
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Centralizador para consulta rápida de scripts de atendimento e normativas internas com gestão de acesso corporativo.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} SCP Enterprise. Todos os direitos reservados.
        </div>
      </div>

      {/* Painel Direito - Formulário de Autenticação */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-900 lg:bg-slate-950">
        <div className="w-full max-w-md space-y-8 bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl">
          <div>
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg">
                <Building2 size={20} />
              </div>
              <span className="text-sm font-bold text-white tracking-wider uppercase">SCP Enterprise</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Autenticação</h2>
            <p className="text-xs text-slate-400 mt-1">
              Informe suas credenciais corporativas para prosseguir.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                E-mail Corporativo
              </label>
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
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Senha de Acesso
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
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl transition duration-150 shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Acessar</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Acesso monitorado. Em caso de dúvidas, acione a equipe de Service Desk ou TI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}