const app = require('express');
const { getCourses, getCourse, addCourse } = require('../controllers/courses');

const router = app.Router({ mergeParams: true });

router
  .route('/')
  .get(getCourses)
  .post(addCourse);

router.route('/:id').get(getCourse);

module.exports = router;
