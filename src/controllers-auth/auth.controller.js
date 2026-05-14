import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../../models/index.js';

const { Usuario } = db;

const ROOT_USER = {
  id: 0,
  email: 'root@local',
  password: 'rootpass',
  isAdmin: true
};

/**
 * Generar un token CSRF seguro
 */
export const generarTokenCSRF = () => {
  return crypto.randomBytes(32).toString('hex');
};

const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || '86400000', 10);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: COOKIE_MAX_AGE
};

const crearTokensParaUsuario = (usuario) => {
  const csrfToken = generarTokenCSRF();
  const payload = {
    id: usuario.id,
    email: usuario.email,
    isAdmin: usuario.isAdmin || false,
    apiKey: process.env.API_KEY || 'local-secret-key',
    csrfToken
  };

  const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET || 'local_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });

  return { tokenJWT, csrfToken };
};

/**
 * Login - Generar tokens JWT y CSRF
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password || !password.trim()) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let usuario;

    if (normalizedEmail === ROOT_USER.email && password === ROOT_USER.password) {
      let dbRootUser = await Usuario.findOne({
        where: {
          email: ROOT_USER.email,
          id: { [db.Sequelize.Op.ne]: 0 }
        },
        order: [['id', 'DESC']]
      });

      if (!dbRootUser) {
        dbRootUser = await Usuario.create({
          nombre: 'Root',
          email: ROOT_USER.email,
          password: ROOT_USER.password,
          activo: true
        });
      }

      usuario = { id: dbRootUser.id, email: dbRootUser.email, isAdmin: ROOT_USER.isAdmin };
    } else {
      const encontrado = await Usuario.findOne({ where: { email: normalizedEmail, password } });
      if (!encontrado) {
        return res.status(401).json({ error: 'Email o contraseña inválidos' });
      }
      usuario = { id: encontrado.id, email: encontrado.email, isAdmin: false };
    }

    const { tokenJWT, csrfToken } = crearTokensParaUsuario(usuario);

    res.cookie('jwt_token', tokenJWT, COOKIE_OPTIONS);
    res.cookie('csrf_token', csrfToken, {
      ...COOKIE_OPTIONS,
      httpOnly: false
    });

    res.json({
      mensaje: 'Login exitoso',
      usuario,
      csrfToken
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el proceso de login' });
  }
};

export const oauthCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL || 'https://localhost:3000'}/login`);
    }

    const usuario = {
      id: req.user.id,
      email: req.user.email,
      isAdmin: false
    };

    const { tokenJWT, csrfToken } = crearTokensParaUsuario(usuario);

    res.cookie('jwt_token', tokenJWT, COOKIE_OPTIONS);
    res.cookie('csrf_token', csrfToken, {
      ...COOKIE_OPTIONS,
      httpOnly: false
    });

    res.redirect(`${process.env.CLIENT_URL || 'https://localhost:3000'}/tareas`);
  } catch (error) {
    console.error('Error en OAuth callback:', error);
    res.status(500).json({ error: 'Error en el proceso de autenticación con Google' });
  }
};

/**
 * Logout - Eliminar cookies
 */
export const logout = (req, res) => {
  try {
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    res.clearCookie('csrf_token', {
      secure: true,
      sameSite: 'none'
    });

    res.json({ mensaje: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error en el proceso de logout' });
  }
};

/**
 * Verificar estado de autenticación
 */
export const verificarAuth = (req, res) => {
  try {
    // El middleware ya verificó el token, así que solo devolvemos la info del usuario
    res.json({
      autenticado: true,
      usuario: req.usuario
    });
  } catch (error) {
    console.error('Error al verificar auth:', error);
    res.status(500).json({ error: 'Error al verificar autenticación' });
  }
};