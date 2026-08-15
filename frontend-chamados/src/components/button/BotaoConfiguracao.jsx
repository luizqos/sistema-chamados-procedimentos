'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Settings, Shield, Users } from 'lucide-react';

export default function BotaoConfiguracao() {
  const tSidebar = useTranslations('Sidebar');
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setAdminMenuOpen(!adminMenuOpen)}
        className={`flex items-center justify-center p-2 rounded-md font-semibold transition border cursor-pointer ${
          adminMenuOpen 
            ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100' 
            : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
        }`}
        title={tSidebar('segurancaSSO') || 'Configurações'}
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
            {tSidebar('segurancaSSO')}
          </Link>
          <Link
            href="/usuarios"
            onClick={() => setAdminMenuOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Users size={16} className="text-sky-600 dark:text-sky-500" />
            {tSidebar('gestaoUsuarios')}
          </Link>
        </div>
      )}
    </div>
  );
}