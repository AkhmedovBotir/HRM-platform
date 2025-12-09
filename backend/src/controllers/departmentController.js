const Department = require('../models/Department');

// Create Department
const createDepartment = async (req, res) => {
  try {
    const { nom, status } = req.body;
    const companyId = req.company._id;

    // Check if department with same nom exists in this company
    const existingDepartment = await Department.findOne({
      companyId,
      nom,
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan bo\'lim allaqachon mavjud',
      });
    }

    const department = new Department({
      companyId,
      nom,
      status: status || 'active',
    });

    await department.save();

    res.status(201).json({
      success: true,
      message: 'Bo\'lim muvaffaqiyatli yaratildi',
      department: {
        id: department._id,
        companyId: department.companyId,
        nom: department.nom,
        status: department.status,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create department error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan bo\'lim allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Departments
const getAllDepartments = async (req, res) => {
  try {
    const companyId = req.company._id;
    const departments = await Department.find({ companyId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error('Get all departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Department
const getDepartment = async (req, res) => {
  try {
    const companyId = req.company._id;
    const department = await Department.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Bo\'lim topilmadi',
      });
    }

    res.json({
      success: true,
      department,
    });
  } catch (error) {
    console.error('Get department error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri bo\'lim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Department
const updateDepartment = async (req, res) => {
  try {
    const { nom } = req.body;
    const companyId = req.company._id;

    const department = await Department.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Bo\'lim topilmadi',
      });
    }

    // Check if nom is being changed and if it conflicts with existing
    if (nom && nom !== department.nom) {
      const existingByNom = await Department.findOne({
        companyId,
        nom,
      });
      if (existingByNom) {
        return res.status(400).json({
          success: false,
          message: 'Bu nom bilan bo\'lim mavjud',
        });
      }
    }

    // Update fields
    if (nom) department.nom = nom;

    await department.save();

    res.json({
      success: true,
      message: 'Bo\'lim muvaffaqiyatli yangilandi',
      department: {
        id: department._id,
        companyId: department.companyId,
        nom: department.nom,
        status: department.status,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update department error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri bo\'lim ID',
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan bo\'lim allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Department Status
const updateDepartmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const companyId = req.company._id;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "active" yoki "inactive" bo\'lishi kerak',
      });
    }

    const department = await Department.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Bo\'lim topilmadi',
      });
    }

    department.status = status;
    await department.save();

    res.json({
      success: true,
      message: 'Bo\'lim status muvaffaqiyatli yangilandi',
      department: {
        id: department._id,
        companyId: department.companyId,
        nom: department.nom,
        status: department.status,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update department status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri bo\'lim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Department
const deleteDepartment = async (req, res) => {
  try {
    const companyId = req.company._id;
    const department = await Department.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Bo\'lim topilmadi',
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bo\'lim muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete department error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri bo\'lim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment,
};







