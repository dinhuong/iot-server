const jwt = require('jsonwebtoken');

const User = require('./models/user');
const Garden = require('./models/garden');
const Sensor = require('./models/sensor');
const { path } = require('express/lib/application');

class Controller {
    async register(req, res, next) {
        const username = req.body.username;
        const user = await User.findOne({username});
        if (user) res.status(409).send('Tên tài khoản đã tồn tại.');
        else {
            const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
            const user = {
                username: username,
                password: hashPassword
            };
            const createdUser = await user.save();
            if (!createdUser) {
                return res
                    .status(400)
                    .send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
            }
            return res.send(createdUser);
        }
    }

    async login(req, res, next) {

        const username = req.body.username
        const password = req.body.password

        const user = await User.findOne({username})
        if (!user) {
            return res.status(401).send('Invalid username');
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }

        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        const dataForAccessToken = {
            user_id: user._id,
        };
        const accessToken = await jwt.sign(dataForAccessToken, accessTokenSecret, accessTokenLife)

        if (!accessToken) {
            return res
                .status(401)
                .send('Login failed. Please try again.');
        }

        return res.json({
            msg: 'Login successful',
            accessToken,
            user,
        });
    }

    async getGardens(req, res, next) {
        const gardens = await req.user.populate("gardens").gardens
        console.log(gardens)
        return res.json(gardens)
    }

    async getSensors(req, res, next) {
        const garden = Garden.findById(req.gardenId)
        garden.areas.map(area => area.populate('sensors'))
        return res.json(garden)
    }
}

module.exports = new Controller();