const express = require('express');

const UserController = require('./controller/user')

const GardenController = require('./controller/gardens')

const AreaController = require('./controller/areas')

const auth = require('./auth.middleware');
const gardens = require('./controller/gardens');

const router = express.Router();

router.post('/register', UserController.register)

router.post('/login', UserController.login);

router.get('/gardens', auth.requireAuth, GardenController.getAll);

router.post('/gardens/create', auth.requireAuth, GardenController.postCeate);

router.delete('/gardens', auth.requireAuth, GardenController.deleteOne);


router.get('/sensors', auth.requireAuth, Controller.getSensors)

module.exports = router;