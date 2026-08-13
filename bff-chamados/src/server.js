const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`A origem ${origin} foi bloqueada pela política de CORS.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ limit: '300mb', extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/', routes);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`BFF rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});

server.timeout = 1800000;
server.keepAliveTimeout = 1800000;