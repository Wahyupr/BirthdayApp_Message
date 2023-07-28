const axios = require('axios');
const Email = require('../models/emailModel');
const User = require('../models/userModels');
const moment = require('moment-timezone');

const axiosInstance = axios.create({
  baseURL: 'https://email-service.digitalenvision.com.au/',
});

const MAX_RETRIES = 5;
const RETRY_DELAY =  60 * 1000;; // // 1 minute
const BAD_GATEWAY_RETRY_DELAY = 60 * 1000; // 1 minute

const sendMessage = (email, subject, message) => {
  return axiosInstance.post('/send-email', {
    email,
    subject,
    message,
  })
  .then(response => {
    return response.status;
  })
  .catch(error => {
    console.error(`Error in sendMessage function: ${error.message}`);
    throw error;
  });
};

const sendEmailFromQueue = async (emailRecord) => {
  if (moment().isBefore(emailRecord.sendAt)) {
    return;
  }
  
  try {
    const status = await sendMessage(emailRecord.email, emailRecord.subject, emailRecord.message);
    if (status === 200) {
      emailRecord.isSent = true;
      // console.log("emailRecord", emailRecord);
      await emailRecord.save();
    } else {
      console.log(`Unexpected status code ${status}`);
    }

  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    if (emailRecord.retryCount < MAX_RETRIES) {
      console.log(`Retrying... Attempt: ${emailRecord.retryCount + 1}`);
      emailRecord.retryCount += 1;
      // console.log("emailRecord", emailRecord);
      await emailRecord.save(emailRecord.email);
    } else {
      console.error(`Failed to send email after ${MAX_RETRIES} attempts.`);
    }
  }
};

const SendEmailBirthdayToday = async (user, retryCount = 0) => {
  try {
    const response = await axios.post('https://email-service.digitalenvision.com.au/send-email', {
      email: user.email,
      subject: 'Happy Birthday!',
      message: `Hey, ${user.firstName} it's your birthday`,
    });

    if (response.status === 200 && response.data.status === 'sent') {
      console.log(`Sending birthday message to ${user.firstName} ${user.lastName} (${user.email}): "Hey, ${user.firstName} ${user.lastName} it’s your birthday"`);
      return {
        userId: user.id,
        isSent: false,
        retries: retryCount,
        email: user.email,
        subject: 'Happy Birthday!',
        message: `Hey, ${user.firstName} it's your birthday`,
      };
    } else if (response.status === 400) {
      console.error('Invalid input');
      // handle the error as needed, perhaps by logging more detailed information
    } else if (response.status === 500) {
      console.error('Server error');
      // retry after a delay
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt: ${retryCount + 1}`);
        setTimeout(() => SendEmailBirthdayToday(user, retryCount + 1), RETRY_DELAY);
      } else {
        console.error(`Failed to send email after ${MAX_RETRIES} attempts.`);
      }
    } else if (response.status === 502) {
      console.error('Bad Gateway');
      // retry after 1 minute
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt: ${retryCount + 1}`);
        setTimeout(() => SendEmailBirthdayToday(user, retryCount + 1), BAD_GATEWAY_RETRY_DELAY);
      } else {
        console.error(`Failed to send email after ${MAX_RETRIES} attempts.`);
      }
    }
  } catch (error) {
    console.error(`Error sending birthday message: ${error.message}`);
    if (error.code === 'ECONNABORTED') {
      // request timeout error
      console.error('Request timed out');
      // retry after a delay
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt: ${retryCount + 1}`);
        setTimeout(() => SendEmailBirthdayToday(user, retryCount + 1), RETRY_DELAY);
      } else {
        console.error(`Failed to send email after ${MAX_RETRIES} attempts.`);
      }
    }
  }
};

module.exports =  { sendEmailFromQueue, SendEmailBirthdayToday };
