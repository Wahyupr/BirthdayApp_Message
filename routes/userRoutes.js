const express = require('express');
const userController = require('../controllers/userControllers');
// const { validate, AddUserValidator, UpdateUserValidator } = require('./validator/index'); // Adjust path according to your project structure

const router = express.Router();

router.post('/user',  userController.createUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/:id', userController.updateUser);

module.exports = router;
