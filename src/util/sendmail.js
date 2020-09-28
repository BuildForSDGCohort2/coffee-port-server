const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.sendMail = async (data) => {
  const msg = {
    to: data.emails,
    from: process.env.SENDER,
    subject: 'Someone reported a User',
    text: 'zmblo text',
    html: `<strong>${data.currentUser.firstName} reported user ${data.user.email} with report message:- ${data.reportMessage}</strong>`,
  };
  try {
    await sgMail.send(msg);
    console.log('email sent');
  } catch (err) {
    throw new Error(err);
  }
};
