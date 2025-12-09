const Joi = require('joi');

const createEmployeeScheduleSchema = Joi.object({
  employeeId: Joi.string().required(),
  templateId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().allow(null).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

const updateEmployeeScheduleSchema = Joi.object({
  templateId: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date().allow(null),
}).unknown(false);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
});

const validateCreateEmployeeSchedule = (req, res, next) => {
  const { error } = createEmployeeScheduleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateEmployeeSchedule = (req, res, next) => {
  const { error } = updateEmployeeScheduleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { error } = updateStatusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateCreateEmployeeSchedule,
  validateUpdateEmployeeSchedule,
  validateUpdateStatus,
};






