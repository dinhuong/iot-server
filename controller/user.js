const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const User = require('./models/user');

module.exports = {
    register: async function(req, res, next) {
        console.log(req.body)
        const username = req.body.username;
        const user = await User.findOne({username});
        if (user) res.status(409).send('Tên tài khoản đã tồn tại.');
        else {
            const hashPassword = bcrypt.hashSync(req.body.password, 10);
            const user = new User({
                username: username,
                password: req.body.password
            });
            const createdUser = await user.save();
            if (!createdUser) {
                return res
                    .status(400)
                    .send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
            }
            return res.send(createdUser);
        }
    },
    
    login: async function (req, res, next) {

        const username = req.body.username
        const password = req.body.password

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).send('Invalid username');
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (password != user.password) {
            return res.status(401).send('Invalid password');
        }

        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        const dataForAccessToken = {
            user_id: user._id,
        };
        const accessToken = await jwt.sign(dataForAccessToken, accessTokenSecret, { expiresIn: accessTokenLife })

        if (!accessToken) {
            return res
                .status(401)
                .send('Login failed. Please try again.');
        }

        return res.json({
            msg: 'Login successful',
            token: accessToken,
            user: user,
        });
    }
}