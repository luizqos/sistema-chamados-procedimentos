export const copyToClipboard = async (text) => {
  try {
    if (!text) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erro ao copiar para a área de transferência:', err);
    return false;
  }
};