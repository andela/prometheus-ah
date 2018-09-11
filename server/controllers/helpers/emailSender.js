import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import emailTemplate from './emailTemplate';

dotenv.config();

const emailSender = (verifyUser) => {
  const url = `http://${process.env.HOST_URL}/confirmation/${verifyUser.hash}`;

  const sendGridKey = process.env.SENDGRID_API_KEY;
  sgMail.setApiKey(sendGridKey);
  const msg = {
    from: `Authors haven <${process.env.NO_REPLY_MAIL}>`,
    to: verifyUser.email,
    subject: 'Verify your email on Authors ✔',
    text: 'Welcome to Author Haven',
    html: emailTemplate.verficationEmail(url)
  };
  sgMail.send(msg);
};

export default emailSender;
