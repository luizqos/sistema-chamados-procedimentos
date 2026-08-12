const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const getAbsolutePath = (relativePath) => {
  return path.join(__dirname, relativePath).replace(/\\/g, '/');
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Chamados',
      version: '1.0.0',
      description: 'Documentação gerada automaticamente',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    getAbsolutePath('../routes/*.js'),
    getAbsolutePath('../controllers/*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;