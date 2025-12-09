const Joi = require('joi');

const phoneRegex = /^\+998\d{9}$/;
const passportRegex = /^[A-Z]{2}\d{7}$/;

const createEmployeeSchema = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  middleName: Joi.string().required().trim(),
  birthDate: Joi.date().required(),
  gender: Joi.string().valid('male', 'female').required(),
  phone: Joi.string()
    .required()
    .pattern(phoneRegex)
    .message('Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  hireDate: Joi.date().required(),
  passport: Joi.string()
    .required()
    .pattern(passportRegex)
    .message('Pasport seriya va raqami AA1234567 formatida bo\'lishi kerak'),
  address: Joi.string().required().trim(),
  departmentId: Joi.string().required(),
  positionId: Joi.string().required(),
});

const updateEmployeeSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  middleName: Joi.string().trim(),
  birthDate: Joi.date(),
  gender: Joi.string().valid('male', 'female'),
  phone: Joi.string()
    .pattern(phoneRegex)
    .message('Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  hireDate: Joi.date(),
  passport: Joi.string()
    .pattern(passportRegex)
    .message('Pasport seriya va raqami AA1234567 formatida bo\'lishi kerak'),
  address: Joi.string().trim(),
  departmentId: Joi.string(),
  positionId: Joi.string(),
}).unknown(false);

const terminateEmployeeSchema = Joi.object({
  terminationDate: Joi.date().optional(),
  terminationReason: Joi.string().required().trim(),
}).unknown(false);

const validateCreateEmployee = (req, res, next) => {
  const { error } = createEmployeeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateEmployee = (req, res, next) => {
  const { error } = updateEmployeeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateTerminateEmployee = (req, res, next) => {
  const { error } = terminateEmployeeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateTerminateEmployee,
};

