import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Loader2, User, Shield, Users, Settings, LogOut } from 'lucide-react';
import BotaoTema from './button/BotaoTema';

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
  
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <aside className="w-80 md:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col h-full transition-colors duration-200">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Atendimento</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Scripts e Procedimentos</p>
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
                    ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100' 
                    : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
                title="Administração"
              >
                <Settings size={18} />
              </button>

              {/* Lista Suspensa (Dropdown) */}
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1.5 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/sso"
                    onClick={() => setAdminMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Shield size={16} className="text-amber-600 dark:text-amber-500" />
                    Segurança SSO
                  </Link>
                  <Link
                    href="/usuarios"
                    onClick={() => setAdminMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Users size={16} className="text-sky-600 dark:text-sky-500" />
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
        <Search size={16} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por título, erro ou comando..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200"
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
                  ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-600 dark:border-sky-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <strong className={`block text-sm font-semibold ${isSelected ? 'text-sky-700 dark:text-sky-400' : 'text-slate-900 dark:text-slate-200'}`}>
                {item.titulo}
              </strong>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 truncate">
                {item.descricao || 'Sem descrição cadastrada'}
              </span>
              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 truncate">
                Por: <strong className="text-slate-600 dark:text-slate-400 font-medium">{nomeAutor}</strong>
              </div>
            </div>
          );
        })}

        <div ref={observerRef} className="py-2 text-center">
          {loadingMore && (
            <div className="flex justify-center items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Loader2 size={16} className="animate-spin" /> Carregando mais...
            </div>
          )}
        </div>
      </div>

      {/* Rodapé: Perfil do Usuário e Logout */}
      {user && (
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 rounded-full flex-shrink-0">
              <User size={18} />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.nome}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded mt-0.5">
                {isAdmin && <Shield size={10} className="text-amber-600 dark:text-amber-500" />}
                {roleNome}
              </span>
            </div>
          </div>
          
          {/* Bloco de Ações Inferiores (Tema e Logout) */}
          <div className="flex items-center gap-1">
            <BotaoTema />
            
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}