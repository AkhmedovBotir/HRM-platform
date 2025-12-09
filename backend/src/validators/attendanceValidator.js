const Joi = require('joi');

const createOrUpdateAttendanceSchema = Joi.object({
  employeeId: Joi.string().required(),
  date: Joi.date().required(),
  checkIn: Joi.date().optional(),
  checkOut: Joi.date().optional(),
  status: Joi.string().valid('present', 'absent', 'late', 'half_day', 'leave').optional(),
  notes: Joi.string().trim().optional(),
});

const updateAttendanceSchema = Joi.object({
  checkIn: Joi.date().allow(null).optional(),
  checkOut: Joi.date().allow(null).optional(),
  status: Joi.string().valid('present', 'absent', 'late', 'half_day', 'leave').optional(),
  notes: Joi.string().trim().allow('').optional(),
}).unknown(false);

const validateCreateOrUpdateAttendance = (req, res, next) => {
  const { error } = createOrUpdateAttendanceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateAttendance = (req, res, next) => {
  const { error } = updateAttendanceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateCreateOrUpdateAttendance,
  validateUpdateAttendance,
};







