import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Tu correo de gmail
      pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación de 16 letras
    },
  });

  const mailOptions = {
    from: '"Bayit Digital" <tu-correo@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;