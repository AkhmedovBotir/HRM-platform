const Joi = require('joi');

const phoneRegex = /^\+998\d{9}$/;

const createCompanySchema = Joi.object({
  nom: Joi.string().required().trim(),
  INN: Joi.string().required().trim(),
  kompaniyaEgasi: Joi.string().required().trim(),
  kompaniyaEgasiTelefon: Joi.string()
    .required()
    .pattern(phoneRegex)
    .message('Kompaniya egasi telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  kompaniyaTelefon: Joi.string()
    .required()
    .pattern(phoneRegex)
    .message('Kompaniya telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  username: Joi.string().required().trim(),
  password: Joi.string().required().min(6),
  status: Joi.string().valid('active', 'inactive').optional(),
});

const updateCompanySchema = Joi.object({
  nom: Joi.string().trim(),
  INN: Joi.string().trim(),
  kompaniyaEgasi: Joi.string().trim(),
  kompaniyaEgasiTelefon: Joi.string()
    .pattern(phoneRegex)
    .message('Kompaniya egasi telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  kompaniyaTelefon: Joi.string()
    .pattern(phoneRegex)
    .message('Kompaniya telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'),
  username: Joi.string().trim(),
  password: Joi.string().min(6),
});

const loginSchema = Joi.object({
  username: Joi.string().required().trim(),
  password: Joi.string().required().min(6),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
});

const validateCreateCompany = (req, res, next) => {
  const { error } = createCompanySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateCompany = (req, res, next) => {
  const { error } = updateCompanySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
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
  validateCreateCompany,
  validateUpdateCompany,
  validateLogin,
  validateUpdateStatus,
};

