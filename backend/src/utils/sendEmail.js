const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    console.log('Début de la configuration SMTP avec les paramètres suivants:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        // Ne pas logger le mot de passe pour des raisons de sécurité
      }
    });

    // Validate required options
    if (!options.email || !options.subject || !options.message) {
      throw new Error('Missing required email options (email, subject, or message)');
    }

    // Validate SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      throw new Error('Missing SMTP configuration in environment variables');
    }

    // Créer un transporteur SMTP réutilisable
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Helps with self-signed certificates in development
      },
      debug: true, // Activer le mode debug
      logger: true // Activer les logs
    });

    console.log('Vérification de la configuration SMTP...');
    // Verify connection configuration
    await transporter.verify();
    console.log('Configuration SMTP vérifiée avec succès');

    // Définir les options de l'email
    const message = {
      from: `${process.env.FROM_NAME || 'EcoDrive'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message
    };

    console.log('Envoi de l\'email à:', options.email);
    // Envoyer l'email
    const info = await transporter.sendMail(message);

    console.log('Email envoyé avec succès:', {
      messageId: info.messageId,
      to: options.email,
      subject: options.subject,
      response: info.response
    });
    
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw new Error('Email de vérification non envoyé: ' + error.message);
  }
};

module.exports = sendEmail;
