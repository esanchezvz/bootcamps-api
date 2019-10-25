const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHanlder = require('../middlewares/async');

// @desc Get courses
// @route GET api/v1/courses
// @route GET api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHanlder(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc Get single course
// @route GET api/v1/course/:id
// @access Public
exports.getCourse = asyncHanlder(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    next(new ErrorResponse(`No course with id of: ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: course });
});

// @desc Add a course
// @route POST api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse = asyncHanlder(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    next(new ErrorResponse(`No bootcamp with id of: ${req.params.bootcampId}`, 404));
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @desc Update a course
// @route PUT api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHanlder(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  delete req.body.bootcamp; // It cannot change botcamps

  if (!course) {
    next(new ErrorResponse(`No bootcamp with id of: ${req.params.id}`, 404));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc Delete a course
// @route PUT api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHanlder(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    next(new ErrorResponse(`No bootcamp with id of: ${req.params.id}`, 404));
  }

  await course.remove();

  res.status(200).json({ success: true, data: `Course deleted succesfuly.` });
});
