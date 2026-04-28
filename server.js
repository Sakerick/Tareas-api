/**
 * Punto de entrada de la aplicación
 */
import 'dotenv/config'
import https from 'https';
import fs from 'fs';

import app from './src/app.js'
const PORT = process.env.PORT || 3100;

const llavePrivada = fs.readFileSync('localhost+2-key.pem');
const certificado = fs.readFileSync('localhost+2.pem');
const credenciales = { key: llavePrivada, cert: certificado, passphrase: 'password' };
const httpsServer = https.createServer(credenciales, app);

httpsServer.listen(PORT, () => {
  console.log(`🚀 Servidor HTTPS corriendo en https://localhost:${PORT}`);
  console.log(`📚 Documentación de endpoints: https://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Error al iniciar el servidor HTTPS:', err);
  process.exit(1);
});

