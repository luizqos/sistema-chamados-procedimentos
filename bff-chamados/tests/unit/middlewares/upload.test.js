const express = require('express');
const request = require('supertest');
const fs = require('fs');
const path = require('path');

const upload = require('../../../src/middlewares/upload');

describe('Upload Middleware', () => {
  let app;
  const caminhoFalsoPng = path.join(__dirname, 'dummy.png');
  const caminhoFalsoExe = path.join(__dirname, 'dummy.exe');

  beforeAll(() => {
    app = express();

    app.post('/test-upload', (req, res, next) => {
      upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
      });
    }, (req, res) => {
      if (!req.file) return res.status(400).json({ error: 'Formato inválido' });
      res.status(200).json({ sucesso: true, arquivo: req.file.filename });
    });

    fs.writeFileSync(caminhoFalsoPng, 'dados da imagem falsa');
    fs.writeFileSync(caminhoFalsoExe, 'dados do virus falso');
  });

  afterAll(() => {
    if (fs.existsSync(caminhoFalsoPng)) fs.unlinkSync(caminhoFalsoPng);
    if (fs.existsSync(caminhoFalsoExe)) fs.unlinkSync(caminhoFalsoExe);
  });

  it('deve permitir o upload de arquivos validos (ex: PNG, JPG, PDF)', async () => {
    const response = await request(app)
      .post('/test-upload')
      .attach('file', caminhoFalsoPng, { filename: 'dummy.png', contentType: 'image/png' });

    expect(response.status).toBe(200);
    expect(response.body.sucesso).toBe(true);

    if (response.body.arquivo) {
      const destinoUpload = path.join(__dirname, '../../../uploads', response.body.arquivo);
      if (fs.existsSync(destinoUpload)) fs.unlinkSync(destinoUpload);
    }
  });

  it('deve rejeitar o upload de arquivos invalidos (fileFilter)', async () => {
    const response = await request(app)
      .post('/test-upload')
      .attach('file', caminhoFalsoExe, { filename: 'dummy.exe', contentType: 'application/x-msdownload' });

    expect(response.status).toBe(400);
  });

  it('deve criar a pasta de uploads na inicialização', () => {
    jest.isolateModules(() => {
      const fs = require('fs');
      const path = require('path');
      const pastaUploads = path.join(__dirname, '../../../uploads');

      if (fs.existsSync(pastaUploads)) {
        fs.rmSync(pastaUploads, { recursive: true, force: true });
      }

      require('../../../src/middlewares/upload');

      expect(fs.existsSync(pastaUploads)).toBe(true);
    });
  });
});