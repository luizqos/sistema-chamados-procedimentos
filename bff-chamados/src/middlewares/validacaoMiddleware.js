const Joi = require('joi');

const REGEX_SENHA_FORTE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const MENSAGEM_ERRO_SENHA = 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.';

const schemaCriacaoUsuario = Joi.object({
  nome: Joi.string().required().messages({
    'any.required': 'O nome é obrigatório.',
    'string.empty': 'O nome não pode estar vazio.'
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'O e-mail é obrigatório.',
    'string.email': 'Informe um e-mail válido.',
    'string.empty': 'O e-mail não pode estar vazio.'
  }),
  senha: Joi.string().pattern(REGEX_SENHA_FORTE).messages({
    'string.pattern.base': MENSAGEM_ERRO_SENHA
  }),
  ssoId: Joi.string().optional(),
  roleId: Joi.number().integer().optional()
}).or('senha', 'ssoId').messages({
  'object.missing': 'Uma forma de autenticação (senha ou ssoId) é obrigatória.'
});

const schemaAtualizacaoUsuario = Joi.object({
  nome: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    'string.email': 'Informe um e-mail válido.'
  }),
  senha: Joi.string().pattern(REGEX_SENHA_FORTE).optional().messages({
    'string.pattern.base': MENSAGEM_ERRO_SENHA
  }),
  ativo: Joi.boolean().optional(),
  roleId: Joi.number().integer().optional()
});

const validar = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const mensagens = error.details.map(detail => detail.message);
      return res.status(400).json({ error: mensagens.join(', ') });
    }
    
    next();
  };
};

module.exports = {
  validar,
  schemaCriacaoUsuario,
  schemaAtualizacaoUsuario
};