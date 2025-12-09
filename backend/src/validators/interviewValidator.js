const Joi = require('joi');

// Skill evaluation schema
const skillEvaluationSchema = Joi.object({
  score: Joi.number().min(1).max(10).optional(),
  comment: Joi.string().trim().optional().allow(''),
});

const createInterviewSchema = Joi.object({
  applicationSubmissionId: Joi.string().required(),
  interviewDate: Joi.date().required(),
  interviewTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': 'Interview time HH:mm formatida bo\'lishi kerak (masalan: "09:00", "14:30")',
  }),
  location: Joi.string().required().trim(),
  interviewer: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional(),
  status: Joi.string().valid('pending', 'scheduled', 'in_progress', 'completed', 'cancelled').optional(),
});

const updateInterviewSchema = Joi.object({
  interviewDate: Joi.date().optional(),
  interviewTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().messages({
    'string.pattern.base': 'Interview time HH:mm formatida bo\'lishi kerak (masalan: "09:00", "14:30")',
  }),
  location: Joi.string().trim().optional(),
  interviewer: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional(),
  status: Joi.forbidden(), // Status alohida endpoint orqali yangilanadi
}).unknown(false);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'scheduled', 'in_progress', 'completed', 'cancelled').required(),
});

// Complete interview with evaluation
const completeInterviewSchema = Joi.object({
  strengths: Joi.string().trim().optional().allow(''),
  weaknesses: Joi.string().trim().optional().allow(''),
  technicalSkills: skillEvaluationSchema.optional(),
  communicationSkills: skillEvaluationSchema.optional(),
  teamwork: skillEvaluationSchema.optional(),
  overallImpression: skillEvaluationSchema.optional(),
  evaluatedBy: Joi.string().trim().optional(),
});

// Make decision schema
const makeDecisionSchema = Joi.object({
  result: Joi.string().valid('passed', 'failed').required(),
  reason: Joi.string().trim().optional().allow(''),
  decidedBy: Joi.string().trim().optional(),
});

// Response status schema
const responseStatusSchema = Joi.object({
  responseStatus: Joi.string().valid('waiting', 'responded').required(),
});

const validateCreateInterview = (req, res, next) => {
  const { error } = createInterviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateUpdateInterview = (req, res, next) => {
  // Status maydonini olib tashlash
  if (req.body.status !== undefined) {
    delete req.body.status;
  }

  const { error } = updateInterviewSchema.validate(req.body);
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

const validateCompleteInterview = (req, res, next) => {
  const { error } = completeInterviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateMakeDecision = (req, res, next) => {
  const { error } = makeDecisionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateResponseStatus = (req, res, next) => {
  const { error } = responseStatusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateCreateInterview,
  validateUpdateInterview,
  validateUpdateStatus,
  validateCompleteInterview,
  validateMakeDecision,
  validateResponseStatus,
};





