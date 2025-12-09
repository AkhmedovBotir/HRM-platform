const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const CompanyAdmin = require('../models/CompanyAdmin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Login Company or Company Admin
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // First try to find company by username
    let company = await Company.findOne({ username });

    if (company) {
      // Check if company is active
      if (company.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Company account is inactive',
        });
      }

      // Check password
      const isPasswordMatch = await company.comparePassword(password);

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Generate token
      const token = generateToken(company._id);

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        type: 'company',
        company: {
          id: company._id,
          nom: company.nom,
          INN: company.INN,
          username: company.username,
          status: company.status,
        },
      });
    }

    // If not found as company, try to find as company admin
    const companyAdmin = await CompanyAdmin.findOne({ username });

    if (!companyAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if admin is active
    if (companyAdmin.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Admin account is inactive',
      });
    }

    // Check password
    const isPasswordMatch = await companyAdmin.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(companyAdmin._id);

    // Populate company info
    await companyAdmin.populate('companyId', 'nom INN');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      type: 'companyAdmin',
      admin: {
        id: companyAdmin._id,
        name: companyAdmin.name,
        phone: companyAdmin.phone,
        username: companyAdmin.username,
        status: companyAdmin.status,
        companyId: companyAdmin.companyId._id,
        companyName: companyAdmin.companyId.nom,
        companyINN: companyAdmin.companyId.INN,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Current Company (Me)
const getMe = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).select('-password');

    res.json({
      success: true,
      company: {
        id: company._id,
        nom: company.nom,
        INN: company.INN,
        kompaniyaEgasi: company.kompaniyaEgasi,
        kompaniyaEgasiTelefon: company.kompaniyaEgasiTelefon,
        kompaniyaTelefon: company.kompaniyaTelefon,
        username: company.username,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create Company
const createCompany = async (req, res) => {
  try {
    const {
      nom,
      INN,
      kompaniyaEgasi,
      kompaniyaEgasiTelefon,
      kompaniyaTelefon,
      username,
      password,
    } = req.body;

    // Check if company with same INN or username exists
    const existingCompany = await Company.findOne({
      $or: [{ INN }, { username }],
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: existingCompany.INN === INN
          ? 'Bu INN bilan kompaniya mavjud'
          : 'Bu username bilan kompaniya mavjud',
      });
    }

    const company = new Company({
      nom,
      INN,
      kompaniyaEgasi,
      kompaniyaEgasiTelefon,
      kompaniyaTelefon,
      username,
      password,
      status: req.body.status || 'active',
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Kompaniya muvaffaqiyatli yaratildi',
      company: {
        id: company._id,
        nom: company.nom,
        INN: company.INN,
        kompaniyaEgasi: company.kompaniyaEgasi,
        kompaniyaEgasiTelefon: company.kompaniyaEgasiTelefon,
        kompaniyaTelefon: company.kompaniyaTelefon,
        username: company.username,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create company error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu INN yoki username allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Company
const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).select('-password');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Kompaniya topilmadi',
      });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error) {
    console.error('Get company error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri kompaniya ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Company
const updateCompany = async (req, res) => {
  try {
    const {
      nom,
      INN,
      kompaniyaEgasi,
      kompaniyaEgasiTelefon,
      kompaniyaTelefon,
      username,
      password,
    } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Kompaniya topilmadi',
      });
    }

    // Check if INN or username is being changed and if it conflicts with existing
    if (INN && INN !== company.INN) {
      const existingByINN = await Company.findOne({ INN });
      if (existingByINN) {
        return res.status(400).json({
          success: false,
          message: 'Bu INN bilan kompaniya mavjud',
        });
      }
    }

    if (username && username !== company.username) {
      const existingByUsername = await Company.findOne({ username });
      if (existingByUsername) {
        return res.status(400).json({
          success: false,
          message: 'Bu username bilan kompaniya mavjud',
        });
      }
    }

    // Update fields
    if (nom) company.nom = nom;
    if (INN) company.INN = INN;
    if (kompaniyaEgasi) company.kompaniyaEgasi = kompaniyaEgasi;
    if (kompaniyaEgasiTelefon) company.kompaniyaEgasiTelefon = kompaniyaEgasiTelefon;
    if (kompaniyaTelefon) company.kompaniyaTelefon = kompaniyaTelefon;
    if (username) company.username = username;
    if (password) company.password = password;

    await company.save();

    res.json({
      success: true,
      message: 'Kompaniya muvaffaqiyatli yangilandi',
      company: {
        id: company._id,
        nom: company.nom,
        INN: company.INN,
        kompaniyaEgasi: company.kompaniyaEgasi,
        kompaniyaEgasiTelefon: company.kompaniyaEgasiTelefon,
        kompaniyaTelefon: company.kompaniyaTelefon,
        username: company.username,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update company error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri kompaniya ID',
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu INN yoki username allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Company Status
const updateCompanyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "active" yoki "inactive" bo\'lishi kerak',
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Kompaniya topilmadi',
      });
    }

    company.status = status;
    await company.save();

    res.json({
      success: true,
      message: 'Kompaniya status muvaffaqiyatli yangilandi',
      company: {
        id: company._id,
        nom: company.nom,
        INN: company.INN,
        kompaniyaEgasi: company.kompaniyaEgasi,
        kompaniyaEgasiTelefon: company.kompaniyaEgasiTelefon,
        kompaniyaTelefon: company.kompaniyaTelefon,
        username: company.username,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update company status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri kompaniya ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Company
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Kompaniya topilmadi',
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Kompaniya muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete company error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri kompaniya ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  login,
  getMe,
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
};

