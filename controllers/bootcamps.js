const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHanlder = require('../middlewares/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHanlder(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude (coming from req.params)
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators like $gt, $gte, etc.
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // Finding resource
  let query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: 'courses',
    select: 'title description',
  });

  // Select fields to send in response
  if (req.query.select) {
    // const fields = req.query.select.split(',').join(' '); // turn into an array, then join with space
    const fields = req.query.select.replace(/\b,\b/g, ' '); // replace directly in string
    query = query.select(fields);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.replace(/\b,\b/g, ' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default
  }

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const bootcamps = await query;

  // Paginiation result
  const pagination = {};
  pagination.total = total;

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  return res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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
  const bootcamp = await Bootcamp.findById(req.params.id);

  await bootcamp.remove();

  return !bootcamp
    ? next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404))
    : res
        .status(200)
        .json({ success: true, data: `Deleted bootcamp with id of: ${req.params.id}` });
});

// @desc Get bootcamps within a radius
// @route GET api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHanlder(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians (Divide distance by radius of earth (3,963 mi or 6,378 km))
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc Upload image for bootcamp
// @route PUT api/v1/bootcamps/:id/photo
// @access Private
exports.photoUpload = asyncHanlder(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  const file = req.files.file;

  if (!bootcamp) {
    next(new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404));
  }
  if (!file) {
    next(new ErrorResponse(`Please upload a file`, 400));
  }

  // Validate image
  const maxLimit = process.env.MAX_FILE_UPLOAD / process.env.MAX_FILE_UPLOAD; // In MB
  if (!file.mimetype.startsWith('image/')) {
    next(new ErrorResponse(`Invalid file type.`, 400));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    next(new ErrorResponse(`Image needs to be less than ${maxLimit}mb`, 400));
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error('Aqui está el puto error'.red, err);
      return next(new ErrorResponse('Problem with file upload.', 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
