const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API BFF - Sistema de Atendimento',
      version: '1.0.0',
      description: 'Documentação da API do sistema de procedimentos e scripts de atendimentos',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor Local (BFF)',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;