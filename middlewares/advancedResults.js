/*
 * @params model = <model-required-for-search>
 * @params populate = { path: '<path-to-populate>', select: '<fields-to-show-spaced-separeted' }
 *         If you want all fields, just pass in 'path-to-populate', not an object
 */

const advancedResults = (model, populate) => async (req, res, next) => {
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
  let query = model.find(JSON.parse(queryStr));

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
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate query
  if (populate) {
    query = query.populate(populate);
  }

  // Execute query
  const results = await query;

  // Paginiation result
  const pagination = {};
  pagination.total = total;

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
