const express = require('express');

const UserController = require('./controllers/user')

const GardenController = require('./controllers/gardens')

const AreaController = require('./controllers/areas')

const DeviceController = require('./controllers/device')

const auth = require('./auth.middleware');
const { route } = require('express/lib/application');

const router = express.Router();

router.post('/register', UserController.register)

router.post('/login', UserController.login);

router.get('/gardens', auth.requireAuth, GardenController.getAll);

router.post('/gardens/create', auth.requireAuth, GardenController.postCeate);

router.delete('/gardens', auth.requireAuth, GardenController.deleteOne);

router.get('/areas/:areaId', auth.requireAuth, AreaController.getOne);

router.get('/areas', auth.requireAuth, AreaController.getAll);

router.post('/areas/create', auth.requireAuth, AreaController.postCeate);

router.delete('/areas', auth.requireAuth, AreaController.deleteOne);

router.get('/devices', DeviceController.getAll)

router.post('/devices/create', DeviceController.postCreate)

router.get('/devices/:deviceId', DeviceController.bind)

module.exports = router;