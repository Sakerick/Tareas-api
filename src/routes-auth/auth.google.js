import google from 'googleapis';


const oauth2Client = new google.auth.OAuth2(
   process.env.GOOGLE_CLIENT_ID,
   process.env.GOOGLE_CLIENT_SECRET,
   process.env.GOOGLE_REDIRECT_URI
);


// Generador de tokens CSRF
function generarTokenCSRF() {
   return crypto.randomBytes(32).toString('hex');
}


// Verificador de tokens CSRF
function verificarTokenCSRF(tokenCSRF, tokenSesion) {
   try {
       const payload = jwt.verify(tokenSesion, process.env.JWT_SECRET);
       return payload.csrfToken === tokenCSRF;
   } catch (error) {
       return false;
   }
}


// Endpoint de login con Google
app.get('/auth/google/login', (req, res) => {


  
   // Crear URL de autorización de Google
   const authUrl = oauth2Client.generateAuthUrl({
       access_type: 'offline',
       scope: [
           'https://www.googleapis.com/auth/userinfo.profile',
           'https://www.googleapis.com/auth/userinfo.email'
       ],


   });
   res.send(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
   try {
       const { code, state } = req.query;
      
       // Intercambiar código por tokens de acceso
       const { tokens } = await oauth2Client.getToken(code);
       oauth2Client.setCredentials(tokens);
      
       // Obtener información del usuario de Google
       const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
       const { data } = await oauth2.userinfo.get();
       const nuevoTokenCSRF = generarTokenCSRF();
       res.cookie('csrf_token', nuevoTokenCSRF, {
           httpOnly: false, // IMPORTANTE: false para que JavaScript pueda leerlo
           secure: true,
           sameSite: 'lax',
           maxAge: 15 * 60 * 1000 // 15 minutos (misma duración que access_token)
       });


       const tokenAcceso = jwt.sign(
           {
               userId: usuario.id,
               email: usuario.email,
               csrfToken: nuevoTokenCSRF // Incluir CSRF en el JWT para verificación
           },
           process.env.JWT_SECRET,
           { expiresIn: '15m' }
       );
      res.cookie('access_token', tokenAcceso, {
           httpOnly: true,
           secure: true,
           sameSite: 'lax',
           maxAge: 15 * 60 * 1000 // 15 minutos
       });

       console.log(data);
 res.send(JSON.stringify(data));


           
   } catch (error) {
       console.error('Error en callback de Google:', error);
       res.status(500).json({
           error: 'Error en la autenticación con Google'
       });
   }
});

