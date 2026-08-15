const fs = require('fs');
const path = require('path');

const carregarMensagens = (locale) => {
  try {
    const caminho = path.join(__dirname, `../messages/${locale}.json`);
    const arquivo = fs.readFileSync(caminho, 'utf8');
    return JSON.parse(arquivo);
  } catch (err) {
    const caminhoFallback = path.join(__dirname, '../messages/pt-BR.json');
    return JSON.parse(fs.readFileSync(caminhoFallback, 'utf8'));
  }
};

function obterValorAninhado(obj, caminho) {
  return caminho.split('.').reduce((acumulador, chave) => acumulador?.[chave], obj);
}

const t = (locale = 'pt-BR', chave) => {
  const mensagens = carregarMensagens(locale);
  const texto = obterValorAninhado(mensagens, chave);
  return texto || chave;
};

module.exports = { t };