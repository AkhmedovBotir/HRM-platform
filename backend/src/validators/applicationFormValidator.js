const Joi = require('joi');

const questionSchema = Joi.object({
  question: Joi.string().required().trim(),
  type: Joi.string().valid('text', 'textarea', 'number', 'email', 'phone', 'select', 'radio', 'checkbox', 'date', 'file').required(),
  required: Joi.boolean().optional(),
  options: Joi.array().items(Joi.string()).optional(),
  placeholder: Joi.string().trim().allow('', null).optional(),
  order: Joi.number().integer().min(0).optional(),
});

const createApplicationFormSchema = Joi.object({
  vacancyId: Joi.string().required(),
  nom: Joi.string().required().trim(),
  questions: Joi.array().items(questionSchema).min(1).required(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

const updateApplicationFormSchema = Joi.object({
  nom: Joi.string().trim().optional(),
  questions: Joi.array().items(questionSchema).min(1).optional(),
  status: Joi.forbidden(), // Status alohida endpoint orqali yangilanadi
}).unknown(false);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
});

const validateCreateApplicationForm = (req, res, next) => {
  const { error } = createApplicationFormSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateApplicationForm = (req, res, next) => {
  // Status maydonini olib tashlash
  if (req.body.status !== undefined) {
    delete req.body.status;
  }

  const { error } = updateApplicationFormSchema.validate(req.body);
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
  validateCreateApplicationForm,
  validateUpdateApplicationForm,
  validateUpdateStatus,
};

