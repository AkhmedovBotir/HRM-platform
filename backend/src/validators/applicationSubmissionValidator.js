const Joi = require('joi');

const answerSchema = Joi.object({
  questionId: Joi.string().required(),
  answer: Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
    Joi.array().items(Joi.string()),
    Joi.date()
  ).required(),
});

const submitApplicationSchema = Joi.object({
  vacancyId: Joi.string().required(),
  answers: Joi.array().items(answerSchema).min(1).required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').required(),
  notes: Joi.string().trim().optional(),
});

const validateSubmitApplication = (req, res, next) => {
  const { error } = submitApplicationSchema.validate(req.body);
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
  validateSubmitApplication,
  validateUpdateStatus,
};





