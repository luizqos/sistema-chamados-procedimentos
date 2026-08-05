import React, { useEffect, useRef } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';

export default function Sidebar({ 
  busca, 
  setBusca, 
  procedimentos, 
  selecionado, 
  onSelect, 
  onOpenModal,
  hasMore,
  loadingMore,
  onLoadMore 
}) {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  return (
    <aside className="w-80 md:w-96 bg-white border-r border-slate-200 p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Atendimento</h2>
          <p className="text-xs text-slate-500">Scripts e Procedimentos</p>
        </div>
        <button 
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md font-semibold text-xs transition"
        >
          <Plus size={16} /> Novo
        </button>
      </div>

      {/* Input de Busca */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar por título, erro ou comando..." 
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Lista com Scroll Infinito */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-light flex flex-col gap-2 pr-1">
        {procedimentos.map((item) => {
          const isSelected = selecionado?.id === item.id;
          return (
            <div 
              key={item.id} 
              onClick={() => onSelect(item.id)}
              className={`p-3 rounded-lg cursor-pointer transition border ${
                isSelected 
                  ? 'bg-sky-50 border-sky-600' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <strong className={`block text-sm font-semibold ${isSelected ? 'text-sky-700' : 'text-slate-900'}`}>
                {item.titulo}
              </strong>
              <span className="text-xs text-slate-500 block mt-1 truncate">
                {item.descricao || 'Sem descrição cadastrada'}
              </span>
            </div>
          );
        })}

        {/* Sentinela de Scroll Infinito */}
        <div ref={observerRef} className="py-2 text-center">
          {loadingMore && (
            <div className="flex justify-center items-center gap-2 text-slate-500 text-xs">
              <Loader2 size={16} className="animate-spin" /> Carregando mais...
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}