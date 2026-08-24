const app = require('./src/app');
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`BFF rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});

server.timeout = 1800000;
server.keepAliveTimeout = 1800000;