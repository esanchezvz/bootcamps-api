const app = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  photoUpload,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middlewares/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');

// Initialize router
const router = app.Router();

// Re-route to other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  .get(advancedResults(Bootcamp, { path: 'courses', fields: 'title description' }), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/:id/photo').put(photoUpload);

module.exports = router;
