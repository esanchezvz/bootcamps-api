const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHanlder = require('../middlewares/async');

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHanlder(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  return res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc Create a new bootcamp
// @route POST api/v1/bootcamps/
// @access Private
exports.createBootcamp = asyncHanlder(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  return res.status(201).json({ success: true, data: bootcamp });
});

// @desc Get a single bootcamp
// @route GET api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHanlder(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  return !bootcamp
    ? next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404))
    : res.status(200).json({ success: true, data: bootcamp });
});

// @desc Update a bootcamp
// @route PUT api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHanlder(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return !bootcamp
    ? next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404))
    : res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete a bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHanlder(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  return !bootcamp
    ? next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404))
    : res
        .status(200)
        .json({ success: true, data: `Deleted bootcamp with id of: ${req.params.id}` });
});
