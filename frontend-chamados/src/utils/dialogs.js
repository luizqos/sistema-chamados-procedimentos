import Swal from 'sweetalert2';

const CustomSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-xl font-sans border border-slate-200 shadow-2xl',
    title: 'text-lg font-bold text-slate-900',
    htmlContainer: 'text-sm text-slate-600',
    confirmButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-sm transition mx-1',
    cancelButton: 'px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition mx-1',
  },
  buttonsStyling: false,
});

export const dialog = {
  /**
   * Dispara um modal de confirmação para ações destrutivas ou críticas.
   */
  async confirmarExclusao({
    titulo = 'Tem certeza?',
    texto = 'Esta ação não poderá ser desfeita!',
    textoBotaoConfirmar = 'Sim, excluir',
    textoBotaoCancelar = 'Cancelar',
  } = {}) {
    const result = await CustomSwal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: textoBotaoConfirmar,
      cancelButtonText: textoBotaoCancelar,
      reverseButtons: true,
      iconColor: '#ef4444',
    });

    return result.isConfirmed;
  },

  /**
   * Modal de confirmação genérica (ações não destrutivas).
   */
  async confirmarAcao({
    titulo = 'Confirmar ação?',
    texto = '',
    textoBotaoConfirmar = 'Confirmar',
    textoBotaoCancelar = 'Cancelar',
  } = {}) {
    const result = await CustomSwal.fire({
      title: titulo,
      text: texto,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: textoBotaoConfirmar,
      cancelButtonText: textoBotaoCancelar,
      reverseButtons: true,
      customClass: {
        confirmButton: 'px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg shadow-sm transition mx-1',
        cancelButton: 'px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition mx-1',
      }
    });

    return result.isConfirmed;
  }
};