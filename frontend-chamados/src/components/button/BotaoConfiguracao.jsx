'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Settings, Shield, Users, History } from 'lucide-react';

export default function BotaoConfiguracao() {
  const tSidebar = useTranslations('Sidebar');
  const pathname = usePathname();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCurrentPage = (path) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <div className="relative" ref={menuRef}>
      
      {/* Botão de Engrenagem (Gatilho) */}
      <button
        onClick={() => setAdminMenuOpen(!adminMenuOpen)}
        className={`flex items-center justify-center p-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
          adminMenuOpen
            ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
        title="Configurações do Sistema"
      >
        <Settings size={20} className={`transition-transform duration-500 ${adminMenuOpen ? 'rotate-90' : 'rotate-0'}`} />
      </button>

      {/* Lista Suspensa (Dropdown) */}
      {adminMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
          
          <div className="px-3 py-2 mb-1 border-b border-slate-100 dark:border-slate-800/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Administração</p>
          </div>

          <Link
            href="/usuarios"
            onClick={() => setAdminMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
              isCurrentPage('/usuarios')
                ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${isCurrentPage('/usuarios') ? 'bg-sky-100 dark:bg-sky-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Users size={16} className={isCurrentPage('/usuarios') ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'} />
            </div>
            {tSidebar('gestaoUsuarios')}
          </Link>
          
          <Link
            href="/sso"
            onClick={() => setAdminMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
              isCurrentPage('/sso')
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${isCurrentPage('/sso') ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Shield size={16} className={isCurrentPage('/sso') ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'} />
            </div>
            {tSidebar('segurancaSSO')}
          </Link>
          
          <Link
            href="/auditoria"
            onClick={() => setAdminMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
              isCurrentPage('/auditoria')
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${isCurrentPage('/auditoria') ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <History size={16} className={isCurrentPage('/auditoria') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'} />
            </div>
            {tSidebar('auditoria')}
          </Link>
        </div>
      )}
    </div>
  );
}