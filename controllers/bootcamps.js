const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    return res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

// @desc Create a new bootcamp
// @route POST api/v1/bootcamps/
// @access Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    return res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc Get a single bootcamp
// @route GET api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    return !bootcamp
      ? next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404))
      : res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
    // next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404));
  }
};

// @desc Update a bootcamp
// @route PUT api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return !bootcamp
      ? next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404))
      : res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    return !bootcamp
      ? next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404))
      : res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};
