'use client';

import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { procedimentoService } from '../services/procedimentoService';
import { useUpload } from '../contexts/UploadContext';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES } from '../utils/constants';

export default function ModalNovoProcedimento({ isOpen, onClose, onSuccess }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [script, setScript] = useState('');
  const [arquivos, setArquivos] = useState([]);
  const [erroValidacao, setErroValidacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressoAtual, setProgressoAtual] = useState(0);
  const [statusTexto, setStatusTexto] = useState('');
  
  const uploadContextRef = useRef(null);
  const { registrarOuAtualizarUpload, removerUpload } = useUpload();

  useEffect(() => {
    if (isOpen) {
      limparFormulario();
    }
  }, [isOpen]);

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

  const limparFormulario = () => {
    setTitulo('');
    setDescricao('');
    setScript('');
    setArquivos([]);
    setErroValidacao('');
    setLoading(false);
    setProgressoAtual(0);
    setStatusTexto('');
  };

  const handleCloseModal = () => {
    if (uploadContextRef.current && uploadContextRef.current.emAndamento) {
      uploadContextRef.current.fechado = true;
    }
    
    onClose();
    
    setTimeout(() => {
      limparFormulario();
    }, 150);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (erroValidacao) return;

    const contextoAtual = { emAndamento: false, fechado: false };
    uploadContextRef.current = contextoAtual;

    setLoading(true);
    setProgressoAtual(0);

    try {
      setStatusTexto('Criando procedimento...');
      
      const novoProcedimento = await procedimentoService.criar({
        titulo,
        descricao,
        script_passo_a_passo: script
      });

      if (arquivos.length > 0) {
        contextoAtual.emAndamento = true;

        for (let i = 0; i < arquivos.length; i++) {
          const file = arquivos[i];
          const cardId = `card-upload-${file.name}-${Date.now()}`;

          setStatusTexto(`Enviando arquivo ${i + 1} de ${arquivos.length}: ${file.name}`);

          try {
            await procedimentoService.enviarAnexo(novoProcedimento.id, file, (progressData) => {
              if (!contextoAtual.fechado) {
                setProgressoAtual(progressData.percent);
                setStatusTexto(
                  `Enviando (${i + 1}/${arquivos.length}): ${formatBytes(progressData.loaded)} de ${formatBytes(progressData.total)}`
                );
              } else {
                registrarOuAtualizarUpload(cardId, {
                  nome: file.name,
                  progresso: progressData.percent,
                  status: 'enviando',
                  procedimento: titulo,
                  enviado: progressData.loaded,
                  total: progressData.total
                });
              }
            });

            if (contextoAtual.fechado) {
              registrarOuAtualizarUpload(cardId, { 
                nome: file.name, 
                progresso: 100, 
                status: 'concluido',
                procedimento: titulo 
              });
              setTimeout(() => removerUpload(cardId), 5000);
            }
          } catch (err) {
            console.error(`Erro ao enviar anexo ${file.name}:`, err);
            if (contextoAtual.fechado) {
              registrarOuAtualizarUpload(cardId, { 
                nome: file.name, 
                progresso: progressoAtual, 
                status: 'erro',
                procedimento: titulo 
              });
            } else {
              toast.error(`Falha ao enviar o anexo "${file.name}".`);
            }
          }
        }

        contextoAtual.emAndamento = false;

        if (!contextoAtual.fechado) {
          toast.success('Procedimento e anexos salvos com sucesso!');
          onSuccess();
          handleCloseModal();
        } else {
          onSuccess();
        }
      } else {
        toast.success('Procedimento cadastrado com sucesso!');
        onSuccess();
        handleCloseModal();
      }

    } catch (err) {
      alert('Erro ao cadastrar: ' + (err.response?.data?.error || err.message));
      setLoading(false);
      contextoAtual.emAndamento = false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900">
        
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Novo Procedimento</h3>
            <p className="text-xs text-slate-500 mt-0.5">Cadastre a tratativa padrão e anexe mídias.</p>
          </div>
          <button 
            type="button"
            onClick={handleCloseModal} 
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-200/50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block font-semibold text-xs text-slate-700 mb-1.5">Título do Procedimento *</label>
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
            <label className="block font-semibold text-xs text-slate-700 mb-1.5">Descrição Curta</label>
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
            <label className="block font-semibold text-xs text-slate-700 mb-1.5">Passo a Passo / Script *</label>
            <textarea 
              required 
              rows={6} 
              value={script} 
              onChange={e => setScript(e.target.value)}
              disabled={loading}
              placeholder="Digite as instruções..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-900 text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-xs text-slate-700 mb-1.5">Anexos (Imagens e Vídeos)</label>

            <div className="bg-slate-100 p-3 rounded-lg text-xs text-slate-600 mb-3 space-y-0.5 border border-slate-200">
              <div><strong>Formatos aceitos:</strong> Imagens e Vídeos</div>
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
              {arquivos.length > 0 && !loading && (
                <div className="mt-2 text-xs text-sky-600 font-semibold">{arquivos.length} arquivo(s) selecionado(s)</div>
              )}
            </div>

            {loading && (
              <div className="mt-4 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-sky-600 h-full transition-all duration-150 ease-out" style={{ width: `${progressoAtual}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span className="font-medium truncate max-w-[280px]">{statusTexto}</span>
                  <span className="font-bold">{progressoAtual}%</span>
                </div>
                <p className="text-[10px] text-slate-400 italic text-center pt-1">
                  Se fechar esta janela, o envio continuará exatamente de onde parou em segundo plano pelo card flutuante.
                </p>
              </div>
            )}

            {erroValidacao && (
              <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs font-medium">
                <AlertCircle size={15} /> {erroValidacao}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button 
              type="button" 
              onClick={handleCloseModal} 
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              {loading ? 'Fechar' : 'Cancelar'}
            </button>
            <button 
              type="submit" 
              disabled={loading || !!erroValidacao}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-semibold transition ${
                loading || !!erroValidacao ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Enviando Anexos...' : 'Salvar Procedimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}