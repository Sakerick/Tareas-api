import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar el token JWT desde la cookie HTTP-Only
 * y validar el token CSRF
 */
export const verificarToken = (req, res, next) => {
  try {
    // Obtener el token JWT de la cookie HTTP-Only
    const tokenJWT = req.cookies.jwt_token;
    
    if (!tokenJWT) {
      return res.status(401).json({ error: 'Token JWT no proporcionado' });
    }

    // Obtener el token CSRF del header o, si no está, de la cookie no HTTP-only
    let csrfToken = req.headers['x-csrf-token'];
    if (!csrfToken) {
      csrfToken = req.cookies.csrf_token;
    }

    if (!csrfToken) {
      return res.status(401).json({ error: 'Token CSRF no proporcionado' });
    }

    // Verificar el token JWT
    const jwtSecret = process.env.JWT_SECRET || 'local_jwt_secret'
    const decoded = jwt.verify(tokenJWT, jwtSecret);
    
    // Verificar que el token CSRF coincida con el almacenado en el JWT
    if (decoded.csrfToken !== csrfToken) {
      return res.status(401).json({ error: 'Token CSRF inválido' });
    }

    // Verificar la API key
    const apiKey = process.env.API_KEY || 'local-secret-key'
    if (decoded.apiKey !== apiKey) {
      return res.status(401).json({ error: 'API Key inválida' });
    }

    if (decoded.id === 0) {
      return res.status(401).json({ error: 'Token JWT inválido: usuario no válido' });
    }

    // Agregar información del usuario a la request
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      apiKey: decoded.apiKey,
      isAdmin: decoded.isAdmin || false
    };
    req.user = req.usuario;

    next();
  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token JWT inválido' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token JWT expirado' });
    }
    
    return res.status(500).json({ error: 'Error en autenticación' });
  }
};

/**
 * Middleware para validar la API key en el header (para login)
 */
export const validarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'local-secret-key'

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key no proporcionada' });
  }

  if (apiKey !== validApiKey) {
    return res.status(401).json({ error: 'API Key inválida' });
  }

  next();
};

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "No autorizado. Inicia sesión con Google." });
};