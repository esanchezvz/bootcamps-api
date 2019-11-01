const app = require('express');
const { register } = require('../controllers/auth');

const router = app.Router();

router.post('/register', register);

module.exports = router;
