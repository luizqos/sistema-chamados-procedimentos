export const getApiError = (err, defaultMessage = 'Ocorreu um erro inesperado.') => {
  if (err?.response?.data?.error) {
    return err.response.data.error;
  }
  if (err?.message === 'Network Error') {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }
  return err?.message || defaultMessage;
};