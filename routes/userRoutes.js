const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser, deleteUser, getSummary } = require('../controllers/userController');

// User routes
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:user_name', getUser);
router.delete('/users/:user_name', deleteUser);
router.get('/summary', getSummary);

module.exports = router;
