import { Can } from '../../components/Can';
import { Plus, Trash2 } from 'lucide-react';

export function TabelaProcedimentos({ lista, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Procedimentos</h2>

        {/* Exibe o botão de criar apenas se tiver a permissão necessária */}
        <Can permission="procedimentos:criar">
          <button className="flex items-center gap-2 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold transition">
            <Plus size={16} /> Novo Procedimento
          </button>
        </Can>
      </div>

      {/* Lista */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {lista.map((item) => (
          <div key={item.id} className="p-4 flex justify-between items-center border-b border-slate-800/60 last:border-0">
            <span className="text-sm text-slate-200">{item.titulo}</span>

            {/* Exibe botão de excluir apenas se autorizado */}
            <Can permission="procedimentos:excluir">
              <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400 transition">
                <Trash2 size={16} />
              </button>
            </Can>
          </div>
        ))}
      </div>
    </div>
  );
}