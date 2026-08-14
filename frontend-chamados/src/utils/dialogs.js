import Swal from 'sweetalert2';

const CustomSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-xl font-sans border border-slate-200 shadow-2xl dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100',
    title: 'text-lg font-bold text-slate-900 dark:text-white',
    htmlContainer: 'text-sm text-slate-600 dark:text-slate-300',
    confirmButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-sm transition mx-1 cursor-pointer',
    cancelButton: 'px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition mx-1 cursor-pointer',
  },
  buttonsStyling: false,
});

export const dialog = {
  async confirmarExclusao({
    titulo,
    texto,
    textoBotaoConfirmar,
    textoBotaoCancelar,
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

  async confirmarAcao({
    titulo,
    texto,
    textoBotaoConfirmar,
    textoBotaoCancelar,
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
        confirmButton: 'px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg shadow-sm transition mx-1 cursor-pointer',
        cancelButton: 'px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition mx-1 cursor-pointer',
      }
    });
    return result.isConfirmed;
  }
};