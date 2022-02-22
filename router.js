const express = require('express');

const UserController = require('./controllers/user')

const GardenController = require('./controllers/garden')

const AreaController = require('./controllers/area')

const DeviceController = require('./controllers/device')

const auth = require('./auth.middleware');
const { route } = require('express/lib/application');

const router = express.Router();

router.post('/register', UserController.register)

router.post('/login', UserController.login);

//garden

router.get('/gardens', auth.requireAuth, GardenController.getAll);

router.post('/gardens/create', auth.requireAuth, GardenController.postCeate);

router.delete('/gardens', auth.requireAuth, GardenController.deleteOne);

//area

router.get('/areas/:areaId', auth.requireAuth, AreaController.getOne);

router.get('/areas', auth.requireAuth, AreaController.getAll);

router.post('/areas/create', auth.requireAuth, AreaController.postCeate);

router.delete('/areas', auth.requireAuth, AreaController.deleteOne);

//device

router.get('/devices', auth.requireAuth, DeviceController.getAreaDevice)

router.post('/devices/create', auth.requireAuth, DeviceController.createVirtual)

router.delete('/devices', auth.requireAuth, DeviceController.deleteVirtual)

//manage real device

router.get('/devices/manage/getUnbinded', auth.requireAuth, DeviceController.getRealDevice)

router.get('/devices/manage/bind', auth.requireAuth, DeviceController.bind)

router.post('/devices/manage/create', auth.requireAuth, DeviceController.createReal)

module.exports = router;