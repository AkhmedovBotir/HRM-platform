const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Position = require('../models/Position');

// Create Employee
const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      birthDate,
      gender,
      phone,
      hireDate,
      passport,
      address,
      departmentId,
      positionId,
    } = req.body;
    const companyId = req.company._id;

    // Check if employee with same passport exists in this company
    const existingEmployee = await Employee.findOne({
      companyId,
      passport,
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Bu pasport bilan xodim allaqachon mavjud',
      });
    }

    // Verify department belongs to company
    const department = await Department.findOne({
      _id: departmentId,
      companyId,
    });

    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Bo\'lim topilmadi yoki bu kompaniyaga tegishli emas',
      });
    }

    // Verify position belongs to company
    const position = await Position.findOne({
      _id: positionId,
      companyId,
    });

    if (!position) {
      return res.status(400).json({
        success: false,
        message: 'Lavozim topilmadi yoki bu kompaniyaga tegishli emas',
      });
    }

    const employee = new Employee({
      companyId,
      firstName,
      lastName,
      middleName,
      birthDate,
      gender,
      phone,
      hireDate,
      passport,
      address,
      departmentId,
      positionId,
    });

    await employee.save();

    // Populate department and position
    await employee.populate('departmentId', 'nom');
    await employee.populate('positionId', 'nom');

    res.status(201).json({
      success: true,
      message: 'Xodim muvaffaqiyatli yaratildi',
      employee: {
        id: employee._id,
        companyId: employee.companyId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        birthDate: employee.birthDate,
        gender: employee.gender,
        phone: employee.phone,
        hireDate: employee.hireDate,
        passport: employee.passport,
        address: employee.address,
        departmentId: employee.departmentId._id,
        departmentName: employee.departmentId.nom,
        positionId: employee.positionId._id,
        positionName: employee.positionId.nom,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create employee error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu pasport bilan xodim allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Employees
const getAllEmployees = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { terminated } = req.query;
    
    // Build query
    const query = { companyId };
    
    // Filter by termination status if provided
    if (terminated !== undefined) {
      query.isTerminated = terminated === 'true';
    }

    const employees = await Employee.find(query)
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Employee
const getEmployee = async (req, res) => {
  try {
    const companyId = req.company._id;
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId,
    })
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Xodim topilmadi',
      });
    }

    res.json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error('Get employee error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri xodim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      birthDate,
      gender,
      phone,
      hireDate,
      passport,
      address,
      departmentId,
      positionId,
    } = req.body;
    const companyId = req.company._id;

    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Xodim topilmadi',
      });
    }

    // Check if passport is being changed and if it conflicts with existing
    if (passport && passport !== employee.passport) {
      const existingByPassport = await Employee.findOne({
        companyId,
        passport,
      });
      if (existingByPassport) {
        return res.status(400).json({
          success: false,
          message: 'Bu pasport bilan xodim mavjud',
        });
      }
    }

    // Verify department if being changed
    if (departmentId && departmentId.toString() !== employee.departmentId.toString()) {
      const department = await Department.findOne({
        _id: departmentId,
        companyId,
      });

      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Bo\'lim topilmadi yoki bu kompaniyaga tegishli emas',
        });
      }
    }

    // Verify position if being changed
    if (positionId && positionId.toString() !== employee.positionId.toString()) {
      const position = await Position.findOne({
        _id: positionId,
        companyId,
      });

      if (!position) {
        return res.status(400).json({
          success: false,
          message: 'Lavozim topilmadi yoki bu kompaniyaga tegishli emas',
        });
      }
    }

    // Update fields
    if (firstName) employee.firstName = firstName;
    if (lastName) employee.lastName = lastName;
    if (middleName) employee.middleName = middleName;
    if (birthDate) employee.birthDate = birthDate;
    if (gender) employee.gender = gender;
    if (phone) employee.phone = phone;
    if (hireDate) employee.hireDate = hireDate;
    if (passport) employee.passport = passport;
    if (address) employee.address = address;
    if (departmentId) employee.departmentId = departmentId;
    if (positionId) employee.positionId = positionId;

    await employee.save();

    // Populate department and position
    await employee.populate('departmentId', 'nom');
    await employee.populate('positionId', 'nom');

    res.json({
      success: true,
      message: 'Xodim muvaffaqiyatli yangilandi',
      employee: {
        id: employee._id,
        companyId: employee.companyId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        birthDate: employee.birthDate,
        gender: employee.gender,
        phone: employee.phone,
        hireDate: employee.hireDate,
        passport: employee.passport,
        address: employee.address,
        departmentId: employee.departmentId._id,
        departmentName: employee.departmentId.nom,
        positionId: employee.positionId._id,
        positionName: employee.positionId.nom,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update employee error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri xodim ID',
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu pasport bilan xodim allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Terminate Employee
const terminateEmployee = async (req, res) => {
  try {
    const { terminationDate, terminationReason } = req.body;
    const companyId = req.company._id;

    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Xodim topilmadi',
      });
    }

    if (employee.isTerminated) {
      return res.status(400).json({
        success: false,
        message: 'Xodim allaqachon ishdan bo\'shatilgan',
      });
    }

    // Update termination fields
    employee.isTerminated = true;
    employee.terminationDate = terminationDate || new Date();
    employee.terminationReason = terminationReason;

    await employee.save();

    // Populate department and position
    await employee.populate('departmentId', 'nom');
    await employee.populate('positionId', 'nom');

    res.json({
      success: true,
      message: 'Xodim muvaffaqiyatli ishdan bo\'shatildi',
      employee: {
        id: employee._id,
        companyId: employee.companyId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        birthDate: employee.birthDate,
        gender: employee.gender,
        phone: employee.phone,
        hireDate: employee.hireDate,
        passport: employee.passport,
        address: employee.address,
        departmentId: employee.departmentId._id,
        departmentName: employee.departmentId.nom,
        positionId: employee.positionId._id,
        positionName: employee.positionId.nom,
        isTerminated: employee.isTerminated,
        terminationDate: employee.terminationDate,
        terminationReason: employee.terminationReason,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      },
    });
  } catch (error) {
    console.error('Terminate employee error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri xodim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const companyId = req.company._id;
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Xodim topilmadi',
      });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Xodim muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri xodim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  terminateEmployee,
  deleteEmployee,
};

