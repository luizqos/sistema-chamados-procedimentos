'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Loader2, ArrowLeft, Plus, Trash2, Globe, Mail, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { WithPermission } from '../components/WithPermission';
import { ssoRegrasService } from '../services/ssoRegrasService';
import { dialog } from '../utils/dialogs';
import ModalNovaRegraSso from '../components/ModalNovaRegraSso';

export default function SsoRegrasPage() {
  const [regras, setRegras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    carregarRegras();
  }, []);

  async function carregarRegras() {
    try {
      setLoading(true);
      const data = await ssoRegrasService.listar();
      setRegras(data);
    } catch (err) {
      toast.error('Erro ao carregar as regras de segurança.');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    const confirmado = await dialog.confirmarExclusao({
      titulo: 'Remover Regra?',
      texto: 'Esta política deixará de valer imediatamente para os próximos acessos.',
    });

    if (confirmado) {
      try {
        await ssoRegrasService.deletar(id);
        toast.success('Regra removida com sucesso!');
        carregarRegras();
      } catch (err) {
        toast.error('Erro ao remover regra.');
      }
    }
  };

  return (
    <WithPermission role="ADMIN">
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition" title="Voltar">
              <ArrowLeft size={20} />
            </Link>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Segurança SSO</h1>
              <p className="text-xs text-slate-400">Restrições de acesso para login via SSO.</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-sky-600/20"
          >
            <Plus size={16} /> Nova Regra
          </button>
        </div>

        {/* Alerta de Allowlist Ativa */}
        {regras.some(r => r.acao === 'PERMITIR') && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={16} /> 
            Modo Restrito Ativado: Apenas domínios/e-mails com regra "Permitir" poderão acessar o sistema.
          </div>
        )}

        {/* Tabela de Regras */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Alvo (Valor)</th>
                    <th className="p-4">Ação / Efeito</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {regras.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">Nenhuma regra configurada. O sistema está aberto para qualquer conta corporativa válida.</td>
                    </tr>
                  ) : (
                    regras.map((r) => (
                      <tr key={r.id} className="transition hover:bg-slate-800/30">
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-950 border border-slate-800 text-sky-400">
                            {r.tipo === 'DOMINIO' ? <Globe size={12} /> : <Mail size={12} />}
                            {r.tipo}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-slate-200">{r.valor}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${r.acao === 'PERMITIR' ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' : 'bg-red-950/60 border-red-500/30 text-red-400'}`}>
                            {r.acao === 'PERMITIR' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {r.acao}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                            title="Remover regra"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ModalNovaRegraSso
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={carregarRegras}
        />
      </div>
    </WithPermission>
  );
}