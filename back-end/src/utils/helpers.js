// Utility function to transform imageUrl
const transformImageUrl = (imageUrl) => {
  return imageUrl
}
/*
const transformImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  const fileIdMatch = imageUrl.match(/id=([^&]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `/api/image/${fileId}?t=${new Date().getTime()}`;
  }
  return imageUrl;
};
*/
// Helper function to transform imageUrls in nested objects
const transformImageUrlsInObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformImageUrlsInObject(item));
  } else if (obj !== null && typeof obj === 'object') {
    const transformedObj = { ...obj };
    for (const key in transformedObj) {
      if (key === 'curso' && transformedObj[key].imageUrl) {
        transformedObj[key].imageUrl = transformImageUrl(transformedObj[key].imageUrl);
      } else if (typeof transformedObj[key] === 'object') {
        transformedObj[key] = transformImageUrlsInObject(transformedObj[key]);
      }
    }
    return transformedObj;
  }
  return obj;
};

//Helper function to send recovery emails
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

async function sendPasswordResetEmail(user, resetToken) {
  
  const OAuth2 = google.auth.OAuth2
    
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  })
  
  try {
    const frontEndUrls = process.env.FRONT_END_URL.split(',');
    const selectedUrl = frontEndUrls[0]

    //const encodedToken = encodeURIComponent(resetToken)

    const resetUrl = `${selectedUrl}/login/reset-password/${resetToken}`
    
    const accessToken = await oauth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    })

    const mailOptions = {
      from: `SaL System <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Recuperação de Senha',
      text: `Olá ${user.nome}, \n\n Você requisitou recuperação de senha do sistema Stop and Learn.
      Por favor, siga o link abaixo para criar uma nova senha: \n\n${resetUrl}\n\n Este link expirará em 1 hora. 
      \n\n Se você não requisitou este link, favor ignorar este e-mail.`
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('E-mail com link para recuperação de senha enviado: ', result)
  } catch (error) {
    console.error('Erro enviando e-mail de recuperação de senha: ', error)
  }  
}
  
export { transformImageUrl, transformImageUrlsInObject, sendPasswordResetEmail };