const Email = require('../models/emailModel');
const { sendEmailFromQueue, SendEmailBirthdayToday } = require('./sendMessageEmail');
const User = require('../models/userModels');
const { Op } = require('sequelize');
const sequelize = require('sequelize'); 

const sendEmailBackgroundProcess = async () => {
  try {
    const emailRecords = await Email.findAll({ where: { isSent: false } });
    await Promise.all(emailRecords.map(sendEmailFromQueue));
  } catch (error) {
    console.error('Error in email background process:', error);
  }
};

const scheduleEmail = async () => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'birthday', 'location', 'timeZone', 'createdAt', 'updatedAt'],
      where: sequelize.literal(`date_part('month', "User"."birthday") = date_part('month', NOW() AT TIME ZONE "User"."timeZone") 
          AND date_part('day', "User"."birthday") = date_part('day', NOW() AT TIME ZONE "User"."timeZone")
          AND date_part('hour', NOW() AT TIME ZONE "User"."timeZone") = 9`)
    });
    

    const dataScheduleEmail = await Promise.all(users.map(user => SendEmailBirthdayToday(user)));

    // Use upsert instead of bulkCreate and check for null values
    await Promise.all(dataScheduleEmail.map(email => {
      if (email) { // checks if the email record is not null
        Email.upsert({
          userId: email.id,
          isSent: email.isSent,
          retries: email.retries,
          email: email.email,
          subject: email.subject,
          message: email.message
        }, { 
          fields: ['userId', 'isSent', 'retries', 'email', 'subject', 'message'], // specify fields to upsert
          returning: true, // returns the affected row 
          where: { email: email.email } // update record if email already exists
        });
      }
    }));
  } catch (error) {
    console.error('Error in email scheduling process:', error);
  }
};

module.exports = { sendEmailBackgroundProcess, scheduleEmail };

