/**
 * Punto de entrada de la aplicación
 */

const app = require('./src/app');

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación de endpoints: http://localhost:${PORT}`);
});
