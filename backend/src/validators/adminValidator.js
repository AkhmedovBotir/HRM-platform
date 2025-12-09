const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required().trim(),
  password: Joi.string().required().min(6),
});

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

module.exports = {
  validateLogin,
};

