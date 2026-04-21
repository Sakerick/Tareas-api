/**
 * Punto de entrada de la aplicación
 */
import 'dotenv/config'


import app from './src/app.js'
const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación de endpoints: http://localhost:${PORT}`);
});
