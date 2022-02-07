const express = require('express');

const Controller = require('./controller');

const auth = require('./auth.middleware')

const router = express.Router();

router.post('/register', Controller.register)

router.post('/login', Controller.login);

router.get('/gardens', Controller.getGardens);

router.get('/sensors', Controller.getSensors)

module.exports = router;