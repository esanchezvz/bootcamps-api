const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHanlder = require('../middlewares/async');

// @desc Register user
// @route GET api/v1/auth/register
// @access Public
exports.register = asyncHanlder(async (req, res, next) => {
  res.status(200).json({ success: true });
});
