const Joi = require('joi');

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/; // HH:mm format

const daySchema = Joi.object({
  startTime: Joi.string().pattern(timeRegex).allow(null).optional(),
  endTime: Joi.string().pattern(timeRegex).allow(null).optional(),
  isWorking: Joi.boolean().optional(),
});

const createTemplateSchema = Joi.object({
  nom: Joi.string().required().trim(),
  monday: daySchema.optional(),
  tuesday: daySchema.optional(),
  wednesday: daySchema.optional(),
  thursday: daySchema.optional(),
  friday: daySchema.optional(),
  saturday: daySchema.optional(),
  sunday: daySchema.optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

const updateTemplateSchema = Joi.object({
  nom: Joi.string().trim(),
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
}).unknown(false);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
});

const validateCreateTemplate = (req, res, next) => {
  const { error } = createTemplateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateTemplate = (req, res, next) => {
  const { error } = updateTemplateSchema.validate(req.body);
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
  validateCreateTemplate,
  validateUpdateTemplate,
  validateUpdateStatus,
};






