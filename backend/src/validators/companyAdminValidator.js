const Joi = require('joi');

const phoneRegex = /^\+998\d{9}$/;

const createCompanyAdminSchema = Joi.object({
  name: Joi.string().required().trim(),
  phone: Joi.string()
    .required()
    .pattern(phoneRegex)
    .message('Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  username: Joi.string().required().trim(),
  password: Joi.string().required().min(6),
  status: Joi.string().valid('active', 'inactive').optional(),
});

const updateCompanyAdminSchema = Joi.object({
  name: Joi.string().trim(),
  phone: Joi.string()
    .pattern(phoneRegex)
    .message('Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  username: Joi.string().trim(),
  password: Joi.string().min(6),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
});

const validateCreateCompanyAdmin = (req, res, next) => {
  const { error } = createCompanyAdminSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateCompanyAdmin = (req, res, next) => {
  const { error } = updateCompanyAdminSchema.validate(req.body);
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
  validateCreateCompanyAdmin,
  validateUpdateCompanyAdmin,
  validateUpdateStatus,
};







