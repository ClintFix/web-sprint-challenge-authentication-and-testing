const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../secrets');
const { checkUniqueUsername, validateUserBody, checkUsernameExists } = require('../middleware/users-middleware');
const Users = require('../users/users-model');

router.post('/register', validateUserBody, checkUniqueUsername, (req, res, next) => {
  let user = req.body;

  const rounds = process.env.BCRYPT_ROUNDS || 8;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;

  Users.add(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(next);
});

router.post('/login', validateUserBody, checkUsernameExists, (req, res, next) => {
  let { password, user } = req.body;

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = makeToken(user);
    res.status(200).json({
      message: `welcome, ${user.username}`,
      token
    });
  } else {
    next({message: 'invalid credentials', status: 401});
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

//TOKEN CREATION
function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
