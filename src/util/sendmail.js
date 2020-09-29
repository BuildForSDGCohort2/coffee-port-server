const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendReportMail = async ({
  emails,
  user,
  reportMessage,
  currentUser,
}) => {
  const msg = {
    to: emails,
    from: process.env.SENDER,
    subject: 'Someone reported a User',
    text: 'zmblo text',
    html: `<strong>${currentUser.firstName} reported user ${user.email} with report message:- ${reportMessage}</strong>`,
  };
  try {
    await sgMail.send(msg);
    console.log('email sent');
  } catch (err) {
    throw new Error(err);
  }
};

const sendVerificationMail = async ({ emails, token }) => {
  const msg = {
    to: emails,
    from: process.env.SENDER,
    subject: 'Verification Email',
    text: 'zmblo text',
    html: `<p>We're sending you this email because you've just registered to coffee-port</p>,
    <a href="https://coffee-port.netlify.app/confirm/${token}">click this to verify your email address</a>
    <strong> if you're not aware of this email, please ignore it.`,
  };
  try {
    await sgMail.send(msg);
    console.log('email sent');
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

module.exports = { sendReportMail, sendVerificationMail };
