var User = require('./models/user');
const jwt = require('jsonwebtoken');

module.exports.requireAuth = async function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized');
    }
    await jwt.verify(
        req.cookies.token,
        process.env.ACCESS_TOKEN_SECRET,
        async function (err, decoded) {
            if (decoded == undefined) {
                res.status(401).send('Unauthorized');
            } else {
                const user = await User.findOne({ _id: decoded.user_id })
                if (user) {
                    req.user = user;
                }
            }
        }
    );
    next();
};