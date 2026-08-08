import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Plus, Loader2, LogOut, User, Shield, Users } from 'lucide-react';

export default function Sidebar({ 
  busca, 
  setBusca, 
  procedimentos, 
  selecionado, 
  onSelect, 
  onOpenModal,
  hasMore,
  loadingMore,
  onLoadMore,
  user,
  onLogout
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

  const roleNome = typeof user?.role === 'object' ? user?.role?.nome : user?.role;
  const isAdmin = roleNome === 'ADMIN';
  const isOperador = roleNome === 'OPERADOR';

  return (
    <aside className="w-80 md:w-96 bg-white border-r border-slate-200 p-5 flex flex-col h-full">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Atendimento</h2>
          <p className="text-xs text-slate-500">Scripts e Procedimentos</p>
        </div>
        
        {/* Ações do Cabeçalho */}
        <div className="flex items-center gap-2">
          {/* Botão de Usuários (Visível apenas para ADMIN) */}
          {isAdmin && (
            <Link
              href="/usuarios"
              className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs transition border border-slate-200"
              title="Gestão de Usuários"
            >
              <Users size={16} className="text-sky-600" />
              <span>Usuários</span>
            </Link>
          )}

          {/* Botão Novo Procedimento */}
          {(isAdmin || isOperador) && (
            <button 
              onClick={onOpenModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md font-semibold text-xs transition"
            >
              <Plus size={16} /> Novo
            </button>
          )}
        </div>
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
          const nomeAutor = item.usuario?.nome || 'Sistema';

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

              <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 truncate">
                Por: <strong className="text-slate-600 font-medium">{nomeAutor}</strong>
              </div>
            </div>
          );
        })}

        <div ref={observerRef} className="py-2 text-center">
          {loadingMore && (
            <div className="flex justify-center items-center gap-2 text-slate-500 text-xs">
              <Loader2 size={16} className="animate-spin" /> Carregando mais...
            </div>
          )}
        </div>
      </div>

      {/* Rodapé: Perfil do Usuário e Logout */}
      {user && (
        <div className="pt-4 mt-2 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-full flex-shrink-0">
              <User size={18} />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user.nome}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mt-0.5">
                {isAdmin && <Shield size={10} className="text-amber-600" />}
                {roleNome}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sair do sistema"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}