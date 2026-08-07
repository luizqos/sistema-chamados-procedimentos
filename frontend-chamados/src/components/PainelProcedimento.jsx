import ReactMarkdown from 'react-markdown';
import { Copy, Check, Trash2 } from 'lucide-react';
import GaleriaAnexos from './GaleriaAnexos';

export default function PainelProcedimento({ selecionado, copiado, onCopiar, onDeletar, user }) {
  const isAdmin = user?.role === 'ADMIN';
  const isCriador = selecionado?.usuario_id && user?.id ? selecionado.usuario_id === user.id : false;
  const podeExcluir = isAdmin || isCriador;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{selecionado.titulo}</h1>
          <p className="text-sm text-slate-600">{selecionado.descricao}</p>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <button 
            onClick={onCopiar}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition ${
              copiado ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {copiado ? <><Check size={18} /> Copiado!</> : <><Copy size={18} /> Copiar Script</>}
          </button>

          {/* Exibido para ADMIN ou para o Criador do Procedimento */}
          {podeExcluir && (
            <button 
              onClick={() => onDeletar(selecionado.id)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-sm transition"
              title="Excluir procedimento"
            >
              <Trash2 size={18} /> Excluir
            </button>
          )}
        </div>
      </div>

      {/* Script Markdown com Tamanho Fixo, Scroll e Preservação de Espaçamentos */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Passo a Passo / Script
        </h3>
        
        <div className="h-[400px] overflow-y-auto custom-scrollbar whitespace-pre-wrap bg-slate-900 text-slate-50 p-5 rounded-xl text-sm leading-relaxed font-mono border border-slate-800">
          <ReactMarkdown>{selecionado.script_passo_a_passo}</ReactMarkdown>
        </div>
      </div>

      {/* Anexos */}
      <GaleriaAnexos anexos={selecionado.anexos} />
    </div>
  );
}