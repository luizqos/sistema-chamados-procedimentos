const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const procedimentosRoutes = require('./routes/procedimentos');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ limit: '300mb', extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', healthRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/procedimentos', procedimentosRoutes);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`BFF rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});

server.timeout = 300000;