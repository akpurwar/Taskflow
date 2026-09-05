const express = require('express');
const validate = require('../middleware/validate');
const { signup, login,refresh,logout } = require('../controller/authController');
const { signupSchema, loginSchema } = require('../schema/authSchema');

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh',  refresh);
router.post('/logout',  logout);

module.exports = router;