const express = require('express');

const Controller = require('./controller');

const auth = require('./auth.middleware')

const router = express.Router();

router.post('/register', Controller.register)

router.post('/login', Controller.login);

router.get('/gardens', auth.requireAuth, Controller.getGardens);

router.get('/sensors', auth.requireAuth, Controller.getSensors)

module.exports = router;