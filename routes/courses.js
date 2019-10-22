const app = require('express');
const { getCourses } = require('../controllers/courses');

const router = app.Router({ mergeParams: true });

router.route('/').get(getCourses);

module.exports = router;
