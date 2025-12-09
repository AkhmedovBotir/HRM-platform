const Joi = require('joi');

const createDepartmentSchema = Joi.object({
  nom: Joi.string().required().trim(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

const updateDepartmentSchema = Joi.object({
  nom: Joi.string().trim().optional(),
  status: Joi.forbidden(), // Status qabul qilinmaydi
}).unknown(false);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
});

const validateCreateDepartment = (req, res, next) => {
  const { error } = createDepartmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateDepartment = (req, res, next) => {
  // Status maydoni yuborilgan bo'lsa, uni olib tashlash
  if (req.body.status !== undefined) {
    delete req.body.status;
  }
  
  const { error } = updateDepartmentSchema.validate(req.body);
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
  validateCreateDepartment,
  validateUpdateDepartment,
  validateUpdateStatus,
};

