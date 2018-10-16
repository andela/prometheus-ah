import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import passwordResetTemplate from './passwordResetTemplate';

dotenv.config();

const emailSender = (verifyUser) => {
  const url = `
  ${process.env.HOST_URL}/users/password-reset/?passwordToken=${verifyUser.reset_password_hash}`;
  const sendGridKey = process.env.SENDGRID_API_KEY;
  sgMail.setApiKey(sendGridKey);
  const msg = {
    from: `Authors haven <${process.env.NO_REPLY_MAIL}>`,
    to: verifyUser.email,
    subject: 'Reset your password on Author\'s Haven ✔',
    text: 'Welcome!',
    html: passwordResetTemplate.passwordReset(url)
  };
  sgMail.send(msg);
};

export default emailSender;
