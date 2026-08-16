'use client';

import React, { useState } from 'react';
import { Trash2, Upload, FileText, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { procedimentoService } from '@/src/services/procedimentoService';

export default function GaleriaAnexos({ procedimentoId, anexos = [], podeEditar, onAtualizarAnexos }) {
  const [enviando, setEnviando] = useState(false);
  const [excluindoId, setExcluindoId] = useState(null);

  const handleUpload = async (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    setEnviando(true);
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    try {
      const novoAnexo = await procedimentoService.adicionarAnexo(procedimentoId, formData);
      toast.success('Anexo enviado com sucesso!');
      
      if (onAtualizarAnexos) {
        onAtualizarAnexos([...anexos, novoAnexo]);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao enviar o anexo.');
    } finally {
      setEnviando(false);
      e.target.value = null;
    }
  };

  const handleExcluir = async (anexoId) => {
    if (!confirm('Deseja realmente excluir este anexo?')) return;

    setExcluindoId(anexoId);
    try {
      // Chama o método que deleta no backend
      await procedimentoService.deletarAnexo(anexoId);
      toast.success('Anexo excluído com sucesso!');

      // Remove o anexo da lista visualmente de forma reativa
      if (onAtualizarAnexos) {
        onAtualizarAnexos(anexos.filter(a => a.id !== anexoId));
      }
    } catch (err) {
      toast.error('Erro ao excluir o anexo.');
    } finally {
      setExcluindoId(null);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Anexos e Mídias ({anexos.length})
        </h3>

        {podeEditar && (
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer">
            {enviando ? <Loader2 size={14} className="animate-spin text-sky-500" /> : <Upload size={14} />}
            <span>Adicionar Anexo</span>
            <input
              type="file"
              onChange={handleUpload}
              disabled={enviando}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
          </label>
        )}
      </div>

      {anexos.length === 0 ? (
        <p className="text-xs text-slate-400 italic">Nenhum anexo cadastrado neste procedimento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {anexos.map((anexo) => {
            const isImagem = anexo.tipo === 'imagem' || anexo.mime_type?.startsWith('image/');
            const isVideo = anexo.tipo === 'video' || anexo.mime_type?.startsWith('video/');

            return (
              <div 
                key={anexo.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-lg shrink-0">
                    {isImagem ? <ImageIcon size={18} /> : isVideo ? <Video size={18} /> : <FileText size={18} />}
                  </div>
                  <div className="truncate">
                    <a 
                      href={anexo.caminho_arquivo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:underline truncate block"
                    >
                      {anexo.nome_original}
                    </a>
                    <span className="text-[10px] text-slate-400">
                      {anexo.tamanho_bytes ? `${(anexo.tamanho_bytes / (1024 * 1024)).toFixed(2)} MB` : ''}
                    </span>
                  </div>
                </div>

                {podeEditar && (
                  <button
                    onClick={() => handleExcluir(anexo.id)}
                    disabled={excluindoId === anexo.id}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer shrink-0"
                    title="Excluir Anexo"
                  >
                    {excluindoId === anexo.id ? <Loader2 size={16} className="animate-spin text-red-500" /> : <Trash2 size={16} />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}