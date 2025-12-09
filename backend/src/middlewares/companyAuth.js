const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const authenticateCompany = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id).select('-password');

    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      });
    }

    req.company = company;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid',
    });
  }
};

module.exports = authenticateCompany;







