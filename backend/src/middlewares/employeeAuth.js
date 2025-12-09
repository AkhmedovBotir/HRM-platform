const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const authenticateEmployee = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token taqdim etilmagan',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'employee') {
      return res.status(401).json({
        success: false,
        message: 'Noto\'g\'ri token turi',
      });
    }

    const employee = await Employee.findById(decoded.id)
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom');

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Xodim topilmadi',
      });
    }

    if (employee.isTerminated) {
      return res.status(401).json({
        success: false,
        message: 'Xodim ishdan bo\'shatilgan',
      });
    }

    req.employee = employee;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token yaroqsiz',
    });
  }
};

module.exports = authenticateEmployee;

