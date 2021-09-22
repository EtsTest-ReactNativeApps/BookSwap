const router = require('express').Router();
// const books = require('./controllers/books');
const auth = require('./controllers/auth');

router.post('/register', auth.create);
router.post('/login', auth.login);

module.exports = router;
