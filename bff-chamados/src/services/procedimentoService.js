const repository = require('../repositories/procedimentoRepository');
const fs = require('fs');
const path = require('path');

class ProcedimentoService {
  async listarProcedimentos(busca) {
    return await repository.listar(busca);
  }

  async obterProcedimentoPorId(id) {
    const procedimento = await repository.obterPorId(id);
    if (!procedimento) throw new Error('Procedimento não encontrado');
    return procedimento;
  }

  async criarProcedimento(dados) {
    if (!dados.titulo || !dados.script_passo_a_passo) {
      throw new Error('Título e passo a passo são obrigatórios');
    }
    return await repository.criar(dados);
  }

  async deletarProcedimento(id) {
    const procedimento = await repository.obterPorId(id);
    if (!procedimento) throw new Error('Procedimento não encontrado');

    procedimento.anexos.forEach(anexo => {
      const caminhoAbsoluto = path.join(__dirname, '../../', anexo.caminho_arquivo);
      if (fs.existsSync(caminhoAbsoluto)) {
        fs.unlinkSync(caminhoAbsoluto);
      }
    });

    return await repository.deletar(id);
  }

  async adicionarAnexo(procedimentoId, file) {
    if (!file) throw new Error('Nenhum arquivo enviado');

    const tipo = file.mimetype.startsWith('image/') ? 'imagem' : 'video';
    const caminho_arquivo = `/uploads/${file.filename}`;

    return await repository.criarAnexo({
      procedimento_id: Number(procedimentoId),
      tipo,
      caminho_arquivo,
      nome_original: file.originalname,
      mime_type: file.mimetype,
      tamanho_bytes: file.size
    });
  }
}

module.exports = new ProcedimentoService();