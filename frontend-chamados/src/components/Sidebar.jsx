import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Loader2, User, Shield, Users, Settings } from 'lucide-react';

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
  
  // Estado e Ref para controlar o menu Dropdown
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu admin ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Observador do Scroll Infinito
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
          
          {/* Menu Administrativo Dropdown (Visível apenas para ADMIN) */}
          {isAdmin && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className={`flex items-center justify-center p-2 rounded-md font-semibold transition border ${
                  adminMenuOpen 
                    ? 'bg-slate-200 border-slate-300 text-slate-900' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title="Administração"
              >
                <Settings size={18} />
              </button>

              {/* Lista Suspensa (Dropdown) */}
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/sso"
                    onClick={() => setAdminMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Shield size={16} className="text-amber-600" />
                    Segurança SSO
                  </Link>
                  <Link
                    href="/usuarios"
                    onClick={() => setAdminMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Users size={16} className="text-sky-600" />
                    Gestão de Usuários
                  </Link>
                </div>
              )}
            </div>
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
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Sair"
          >
            <Settings size={18} className="hidden" /> {/* Placeholder para alinhar, mas substituído via CSS ou apenas mantido oculto */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      )}
    </aside>
  );
}