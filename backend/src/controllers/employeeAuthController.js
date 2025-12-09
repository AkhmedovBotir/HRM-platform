const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// Generate username from employee data
const generateUsername = (firstName, lastName, passport) => {
  const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  const suffix = passport.slice(-4);
  return `${base}${suffix}`;
};

// Generate random password
const generatePassword = (length = 8) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Create credentials for employee (by company admin)
const createEmployeeCredentials = async (req, res) => {
  try {
    const { employeeId, username, password } = req.body;
    const companyId = req.company._id;

    const employee = await Employee.findOne({
      _id: employeeId,
      companyId,
      isTerminated: false,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Xodim topilmadi yoki ishdan bo\'shatilgan',
      });
    }

    if (employee.username) {
      return res.status(400).json({
        success: false,
        message: 'Bu xodim uchun login allaqachon yaratilgan',
      });
    }

    // Generate or use provided credentials
    const finalUsername = username || generateUsername(employee.firstName, employee.lastName, employee.passport);
    const finalPassword = password || generatePassword();

    // Check if username already exists
    const existingUsername = await Employee.findOne({
      companyId,
      username: finalUsername.toLowerCase(),
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Bu username allaqachon mavjud',
      });
    }

    employee.username = finalUsername.toLowerCase();
    employee.password = finalPassword;
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Xodim uchun login ma\'lumotlari yaratildi',
      credentials: {
        employeeId: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        username: employee.username,
        password: finalPassword, // Return plain password only once
      },
    });
  } catch (error) {
    console.error('Create employee credentials error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu username allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
};

// Employee login
const employeeLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username va parol talab qilinadi',
      });
    }

    const employee = await Employee.findOne({
      username: username.toLowerCase(),
      isTerminated: false,
    }).select('+password')
      .populate('companyId', 'nom')
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom');

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Noto\'g\'ri username yoki parol',
      });
    }

    if (!employee.password) {
      return res.status(401).json({
        success: false,
        message: 'Bu xodim uchun login yaratilmagan',
      });
    }

    const isMatch = await employee.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Noto\'g\'ri username yoki parol',
      });
    }

    const token = jwt.sign(
      { id: employee._id, type: 'employee' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Muvaffaqiyatli kirish',
      token,
      employee: {
        id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        username: employee.username,
        phone: employee.phone,
        company: employee.companyId,
        department: employee.departmentId,
        position: employee.positionId,
      },
    });
  } catch (error) {
    console.error('Employee login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
};

// Get current employee profile
const getEmployeeProfile = async (req, res) => {
  try {
    const employee = req.employee;

    res.json({
      success: true,
      employee: {
        id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        username: employee.username,
        phone: employee.phone,
        birthDate: employee.birthDate,
        gender: employee.gender,
        address: employee.address,
        hireDate: employee.hireDate,
        department: employee.departmentId,
        position: employee.positionId,
      },
    });
  } catch (error) {
    console.error('Get employee profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const employeeId = req.employee._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Joriy va yangi parol talab qilinadi',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak',
      });
    }

    const employee = await Employee.findById(employeeId).select('+password');

    const isMatch = await employee.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Joriy parol noto\'g\'ri',
      });
    }

    employee.password = newPassword;
    await employee.save();

    res.json({
      success: true,
      message: 'Parol muvaffaqiyatli o\'zgartirildi',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
};

// Reset employee password (by company admin)
const resetEmployeePassword = async (req, res) => {
  try {
    const { employeeId, newPassword } = req.body;
    const companyId = req.company._id;

    const employee = await Employee.findOne({
      _id: employeeId,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Xodim topilmadi',
      });
    }

    if (!employee.username) {
      return res.status(400).json({
        success: false,
        message: 'Bu xodim uchun login yaratilmagan',
      });
    }

    const finalPassword = newPassword || generatePassword();
    employee.password = finalPassword;
    await employee.save();

    res.json({
      success: true,
      message: 'Parol muvaffaqiyatli yangilandi',
      credentials: {
        employeeId: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        username: employee.username,
        password: finalPassword,
      },
    });
  } catch (error) {
    console.error('Reset employee password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
};

// Update employee credentials (username and/or password) by company admin
const updateEmployeeCredentials = async (req, res) => {
  try {
    const { employeeId, username, password } = req.body;
    const companyId = req.company._id;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'employeeId talab qilinadi',
      });
    }

    const employee = await Employee.findOne({
      _id: employeeId,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Xodim topilmadi',
      });
    }

    if (!employee.username) {
      return res.status(400).json({
        success: false,
        message: 'Bu xodim uchun login yaratilmagan. Avval create-credentials ishlatilsin.',
      });
    }

    const updates = {};

    // Update username if provided
    if (username && username.toLowerCase() !== employee.username) {
      const existingUsername = await Employee.findOne({
        companyId,
        username: username.toLowerCase(),
        _id: { $ne: employeeId },
      });

      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Bu username allaqachon mavjud',
        });
      }

      employee.username = username.toLowerCase();
      updates.username = employee.username;
    }

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
        });
      }
      employee.password = password;
      updates.password = password;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Yangilash uchun username yoki password taqdim eting',
      });
    }

    await employee.save();

    res.json({
      success: true,
      message: 'Xodim login ma\'lumotlari yangilandi',
      credentials: {
        employeeId: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        username: employee.username,
        ...(updates.password && { password: updates.password }),
      },
    });
  } catch (error) {
    console.error('Update employee credentials error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu username allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
};

module.exports = {
  createEmployeeCredentials,
  employeeLogin,
  getEmployeeProfile,
  changePassword,
  resetEmployeePassword,
  updateEmployeeCredentials,
};

