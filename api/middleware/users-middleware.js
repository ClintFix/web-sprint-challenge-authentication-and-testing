const Users = require('../users/users-model');

const checkUsernameExists = async (req, res, next) => {
    const { username } = req.body;
    const [user] = await Users.findBy({ username });
    if(!user) {
        next();
    } else {
        next({message: "username taken", status: 400});
    }
};

module.exports = {
    checkUsernameExists,
};
