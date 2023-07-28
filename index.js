const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cron = require('node-cron'); 
const { sendEmailBackgroundProcess, scheduleEmail } = require('./services/sendEmailBackgroundProcess');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', userRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); 
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

// Run the background process for Job every 30 Minute
cron.schedule(`*/30 * * * *`, async () => {
  await sendEmailBackgroundProcess();
  await scheduleEmail();
});

// Schedule cron job get data birthday every 1 minute
cron.schedule(`*/1 * * * *`, async () => {
  try {
    await scheduleEmail();
    console.log('Cron run ');
  } catch (error) {
    console.log('Error :', error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
