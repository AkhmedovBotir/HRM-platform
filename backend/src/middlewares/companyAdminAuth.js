const jwt = require('jsonwebtoken');
const CompanyAdmin = require('../models/CompanyAdmin');

const authenticateCompanyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const companyAdmin = await CompanyAdmin.findById(decoded.id).select('-password');

    if (!companyAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      });
    }

    // Check if admin is active
    if (companyAdmin.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Admin account is inactive',
      });
    }

    req.companyAdmin = companyAdmin;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid',
    });
  }
};

module.exports = authenticateCompanyAdmin;







