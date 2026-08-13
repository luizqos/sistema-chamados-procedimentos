'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { procedimentoService } from '../services/procedimentoService';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES } from '../utils/constants';

export default function ModalNovoProcedimento({ isOpen, onClose, onSuccess }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [script, setScript] = useState('');
  const [arquivos, setArquivos] = useState([]);
  const [erroValidacao, setErroValidacao] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setErroValidacao('');

    for (let file of selectedFiles) {
      const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');
      if (!isImageOrVideo) {
        setErroValidacao(`O arquivo "${file.name}" não é um tipo válido de imagem ou vídeo.`);
        setArquivos([]);
        e.target.value = '';
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErroValidacao(`O arquivo "${file.name}" excede o limite máximo de ${MAX_FILE_SIZE_MB}MB.`);
        setArquivos([]);
        e.target.value = '';
        return;
      }
    }

    setArquivos(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (erroValidacao) return;

    setLoading(true);

    try {
      // 1. Cria o procedimento imediatamente
      const novoProcedimento = await procedimentoService.criar({
        titulo,
        descricao,
        script_passo_a_passo: script
      });

      toast.success('Procedimento cadastrado com sucesso!');
      
      // Fecha a modal e limpa os campos instantaneamente para liberar o usuário
      onSuccess();
      onClose();
      setTitulo('');
      setDescricao('');
      setScript('');
      setArquivos([]);
      setErroValidacao('');

      // 2. Dispara o upload de cada arquivo de forma assíncrona (Background)
      if (arquivos.length > 0) {
        (async () => {
          for (let file of arquivos) {
            // ID único para atualizar o mesmo toast dinamicamente
            const toastId = `upload-${file.name}`;

            // Exibe o toast inicial com barra em 0%
            toast.custom(
              (t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-900 text-white shadow-lg rounded-xl pointer-events-auto flex p-4 border border-slate-800`}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-sky-400 truncate max-w-[220px]">
                        Enviando: {file.name}
                      </p>
                      <span className="text-xs font-semibold text-slate-300">0%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-sky-500 h-full transition-all duration-150" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Aguarde o progresso...</p>
                  </div>
                </div>
              ),
              { id: toastId, duration: Infinity }
            );

            try {
              await procedimentoService.enviarAnexo(novoProcedimento.id, file, (progressData) => {
                // Atualiza o toast em tempo real com a porcentagem e bytes carregados
                toast.custom(
                  (t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-900 text-white shadow-lg rounded-xl pointer-events-auto flex p-4 border border-slate-800`}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-sky-400 truncate max-w-[220px]" title={file.name}>
                            Enviando: {file.name}
                          </p>
                          <span className="text-xs font-semibold text-slate-300">{progressData.percent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-sky-500 h-full transition-all duration-150 ease-out" 
                            style={{ width: `${progressData.percent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                          <span>{formatBytes(progressData.loaded)} de {formatBytes(progressData.total)}</span>
                          <span>Segundo plano</span>
                        </div>
                      </div>
                    </div>
                  ),
                  { id: toastId, duration: Infinity }
                );
              });

              // Sucesso ao finalizar o upload deste arquivo
              toast.success(`Anexo "${file.name}" enviado com sucesso!`, { id: toastId, duration: 4000 });
            } catch (err) {
              console.error(`Erro ao enviar anexo ${file.name}:`, err);
              toast.error(`Falha ao enviar o anexo "${file.name}".`, { id: toastId, duration: 5000 });
            }
          }
        })();
      }

    } catch (err) {
      alert('Erro ao cadastrar: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Novo Procedimento</h3>
            <p className="text-xs text-slate-500 mt-0.5">Cadastre a tratativa padrão e anexe mídias pesadas em background.</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-200/50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block font-semibold text-xs text-slate-700 mb-1.5">
              Título do Procedimento *
            </label>
            <input 
              type="text" 
              required 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)}
              disabled={loading}
              placeholder="Ex: Reset de Senha do Roteador Wi-Fi"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-xs text-slate-700 mb-1.5">
              Descrição Curta
            </label>
            <input 
              type="text" 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)}
              disabled={loading}
              placeholder="Ex: Utilizado para clientes em conexão de Fibra Óptica"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-xs text-slate-700 mb-1.5">
              Passo a Passo / Script *
            </label>
            <textarea 
              required 
              rows={6} 
              value={script} 
              onChange={e => setScript(e.target.value)}
              disabled={loading}
              placeholder="Digite as instruções. Suporta Markdown, listas e blocos de código..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-900 text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Área de Upload */}
          <div className="mb-6">
            <label className="block font-semibold text-xs text-slate-700 mb-1.5">
              Anexos (Imagens e Vídeos)
            </label>

            <div className="bg-slate-100 p-3 rounded-lg text-xs text-slate-600 mb-3 space-y-0.5 border border-slate-200">
              <div><strong>Formatos aceitos:</strong> Imagens (PNG, JPG, WEBP, GIF) e Vídeos (MP4, WEBM, MKV, MOV, AVI)</div>
              <div><strong>Tamanho máximo:</strong> Até {MAX_FILE_SIZE_MB} MB por arquivo</div>
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-lg p-4 text-center bg-slate-50 transition cursor-pointer">
              <Upload size={24} className="mx-auto mb-2 text-sky-600" />
              <input 
                type="file" 
                multiple 
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={loading}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition cursor-pointer"
              />
              {arquivos.length > 0 && (
                <div className="mt-2 text-xs text-sky-600 font-semibold">
                  {arquivos.length} arquivo(s) selecionado(s) para upload em background
                </div>
              )}
            </div>

            {erroValidacao && (
              <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs font-medium">
                <AlertCircle size={15} /> {erroValidacao}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || !!erroValidacao}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-semibold transition ${
                loading || !!erroValidacao 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Salvando Registro...' : 'Salvar e Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}