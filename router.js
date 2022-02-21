const express = require('express');

const UserController = require('./controllers/user')

const GardenController = require('./controllers/gardens')

const AreaController = require('./controllers/areas')

const auth = require('./auth.middleware');
const gardens = require('./controllers/gardens');

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

module.exports = router;