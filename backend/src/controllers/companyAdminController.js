const CompanyAdmin = require('../models/CompanyAdmin');

// Create Company Admin
const createCompanyAdmin = async (req, res) => {
  try {
    const { name, phone, username, password, status } = req.body;
    const companyId = req.company._id;

    // Check if admin with same username exists in this company
    const existingAdmin = await CompanyAdmin.findOne({
      companyId,
      username,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Bu username bilan admin allaqachon mavjud',
      });
    }

    const companyAdmin = new CompanyAdmin({
      companyId,
      name,
      phone,
      username,
      password,
      status: status || 'active',
    });

    await companyAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Company admin muvaffaqiyatli yaratildi',
      admin: {
        id: companyAdmin._id,
        companyId: companyAdmin.companyId,
        name: companyAdmin.name,
        phone: companyAdmin.phone,
        username: companyAdmin.username,
        status: companyAdmin.status,
        createdAt: companyAdmin.createdAt,
        updatedAt: companyAdmin.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create company admin error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu username bilan admin allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Company Admins
const getAllCompanyAdmins = async (req, res) => {
  try {
    const companyId = req.company._id;
    const admins = await CompanyAdmin.find({ companyId })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error('Get all company admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Company Admin
const getCompanyAdmin = async (req, res) => {
  try {
    const companyId = req.company._id;
    const admin = await CompanyAdmin.findOne({
      _id: req.params.id,
      companyId,
    }).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin topilmadi',
      });
    }

    res.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error('Get company admin error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri admin ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Company Admin
const updateCompanyAdmin = async (req, res) => {
  try {
    const { name, phone, username, password } = req.body;
    const companyId = req.company._id;

    const admin = await CompanyAdmin.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin topilmadi',
      });
    }

    // Check if username is being changed and if it conflicts with existing
    if (username && username !== admin.username) {
      const existingByUsername = await CompanyAdmin.findOne({
        companyId,
        username,
      });
      if (existingByUsername) {
        return res.status(400).json({
          success: false,
          message: 'Bu username bilan admin mavjud',
        });
      }
    }

    // Update fields
    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (username) admin.username = username;
    if (password) admin.password = password;

    await admin.save();

    res.json({
      success: true,
      message: 'Admin muvaffaqiyatli yangilandi',
      admin: {
        id: admin._id,
        companyId: admin.companyId,
        name: admin.name,
        phone: admin.phone,
        username: admin.username,
        status: admin.status,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update company admin error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri admin ID',
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu username bilan admin allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Company Admin Status
const updateCompanyAdminStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const companyId = req.company._id;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "active" yoki "inactive" bo\'lishi kerak',
      });
    }

    const admin = await CompanyAdmin.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin topilmadi',
      });
    }

    admin.status = status;
    await admin.save();

    res.json({
      success: true,
      message: 'Admin status muvaffaqiyatli yangilandi',
      admin: {
        id: admin._id,
        companyId: admin.companyId,
        name: admin.name,
        phone: admin.phone,
        username: admin.username,
        status: admin.status,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update company admin status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri admin ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Company Admin
const deleteCompanyAdmin = async (req, res) => {
  try {
    const companyId = req.company._id;
    const admin = await CompanyAdmin.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin topilmadi',
      });
    }

    await CompanyAdmin.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Admin muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete company admin error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri admin ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createCompanyAdmin,
  getAllCompanyAdmins,
  getCompanyAdmin,
  updateCompanyAdmin,
  updateCompanyAdminStatus,
  deleteCompanyAdmin,
};







