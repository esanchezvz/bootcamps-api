// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true });
};

// @desc Get a single bootcamp
// @route GET api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Bootcamp with id: ${req.params.id} retrieved successfully` });
};

// @desc Create a new bootcamp
// @route POST api/v1/bootcamps/
// @access Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: `Bootcamp created successfully` });
};

// @desc Update a bootcamp
// @route PUT api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Bootcamp with id: ${req.params.id} updated successfully` });
};

// @desc Delete a bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Bootcamp with id: ${req.params.id} deleted successfully` });
};
