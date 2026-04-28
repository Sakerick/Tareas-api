import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../models/index.js';
import { configDotenv } from 'dotenv';
const { Usuario } = db;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Perfil recibido de Google:", profile.emails[0].value); // Ver si llegamos aquí
      // 1. Buscamos si el usuario ya existe por su email
      let usuario = await Usuario.findOne({ where: { email: profile.emails[0].value } });

      if (!usuario) {
        // 2. Si no existe, lo creamos
        usuario = await Usuario.create({
          nombre: profile.displayName,
          email: profile.emails[0].value,
          activo: true
          // password: null (al ser OAuth, no necesita password local)
        });
      }
      return done(null, usuario);
    } catch (err) {
      console.error("ERROR EN ESTRATEGIA GOOGLE:", err); // Esto te dirá el error real en la consola
      return done(err, null);
    }
  }
));

// Necesario para mantener la sesión
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await Usuario.findByPk(id);
  done(null, user);
});