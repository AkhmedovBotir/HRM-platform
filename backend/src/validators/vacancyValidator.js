const Joi = require('joi');

const createVacancySchema = Joi.object({
  nom: Joi.string().required().trim(),
  departmentId: Joi.string().required(),
  positionId: Joi.string().required(),
  daraja: Joi.string().required().trim(),
  type: Joi.string().valid('fulltime', 'parttime').required(),
  workScheduleId: Joi.string().required(),
  oylik: Joi.string().required().trim(),
  description: Joi.string().required(),
  responsibilities: Joi.string().required(),
  preferences: Joi.string().required(),
  skills: Joi.array().items(Joi.string()).required(),
  status: Joi.string().valid('active', 'close').optional(),
  minAge: Joi.number().integer().min(0).max(100).optional(),
  maxAge: Joi.number().integer().min(0).max(100).optional(),
});

const updateVacancySchema = Joi.object({
  nom: Joi.string().trim().optional(),
  departmentId: Joi.string().optional(),
  positionId: Joi.string().optional(),
  daraja: Joi.string().trim().optional(),
  type: Joi.string().valid('fulltime', 'parttime').optional(),
  workScheduleId: Joi.string().optional(),
  oylik: Joi.string().trim().optional(),
  description: Joi.string().optional(),
  responsibilities: Joi.string().optional(),
  preferences: Joi.string().optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  minAge: Joi.number().integer().min(0).max(100).optional(),
  maxAge: Joi.number().integer().min(0).max(100).optional(),
  status: Joi.forbidden(), // Status alohida endpoint orqali yangilanadi
  applicationCount: Joi.forbidden(), // Application count alohida endpoint orqali yangilanadi
}).unknown(false);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'close').required(),
});

const updateApplicationCountSchema = Joi.object({
  applicationCount: Joi.number().integer().min(0).required(),
});

const validateCreateVacancy = (req, res, next) => {
  const { error } = createVacancySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  
  // Yosh chegarasini tekshirish
  const { minAge, maxAge } = req.body;
  if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
    return res.status(400).json({
      success: false,
      message: 'Minimal yosh maksimal yoshdan katta bo\'lishi mumkin emas',
    });
  }
  
  next();
};

const validateUpdateVacancy = (req, res, next) => {
  // Status va applicationCount maydonlarini olib tashlash
  if (req.body.status !== undefined) {
    delete req.body.status;
  }
  if (req.body.applicationCount !== undefined) {
    delete req.body.applicationCount;
  }

  const { error } = updateVacancySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  
  // Yosh chegarasini tekshirish
  const { minAge, maxAge } = req.body;
  if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
    return res.status(400).json({
      success: false,
      message: 'Minimal yosh maksimal yoshdan katta bo\'lishi mumkin emas',
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

const validateUpdateApplicationCount = (req, res, next) => {
  const { error } = updateApplicationCountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateCreateVacancy,
  validateUpdateVacancy,
  validateUpdateStatus,
  validateUpdateApplicationCount,
};

