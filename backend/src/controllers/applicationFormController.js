const ApplicationForm = require('../models/ApplicationForm');
const Vacancy = require('../models/Vacancy');

// Create Application Form
const createApplicationForm = async (req, res) => {
  try {
    const { vacancyId, nom, questions, status } = req.body;
    const companyId = req.company._id;

    // Validate that vacancy belongs to company
    const vacancy = await Vacancy.findOne({
      _id: vacancyId,
      companyId,
    });

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vakansiya topilmadi yoki sizning kompaniyangizga tegishli emas',
      });
    }

    // Check if form already exists for this vacancy
    const existingForm = await ApplicationForm.findOne({ vacancyId });
    if (existingForm) {
      return res.status(400).json({
        success: false,
        message: 'Bu vakansiya uchun so\'rovnoma allaqachon mavjud',
      });
    }

    // Validate questions
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Kamida bitta savol bo\'lishi kerak',
      });
    }

    // Validate each question
    const validTypes = ['text', 'textarea', 'number', 'email', 'phone', 'select', 'radio', 'checkbox', 'date', 'file'];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.type) {
        return res.status(400).json({
          success: false,
          message: `Savol ${i + 1}: question va type maydonlari majburiy`,
        });
      }
      if (!validTypes.includes(q.type)) {
        return res.status(400).json({
          success: false,
          message: `Savol ${i + 1}: Noto'g'ri type. Qabul qilinadigan turlar: ${validTypes.join(', ')}`,
        });
      }
      // Select, radio, checkbox uchun options majburiy
      if (['select', 'radio', 'checkbox'].includes(q.type)) {
        if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
          return res.status(400).json({
            success: false,
            message: `Savol ${i + 1}: ${q.type} turi uchun options majburiy va kamida bitta variant bo'lishi kerak`,
          });
        }
      }
      // Order ni o'rnatish
      if (q.order === undefined) {
        q.order = i;
      }
      // Placeholder bo'sh bo'lsa undefined ga o'zgartirish
      if (q.placeholder !== undefined && q.placeholder === '') {
        q.placeholder = undefined;
      }
    }

    const applicationForm = new ApplicationForm({
      companyId,
      vacancyId,
      nom,
      questions,
      status: status || 'active',
    });

    await applicationForm.save();

    // Populate references
    await applicationForm.populate('vacancyId', 'nom');

    res.status(201).json({
      success: true,
      message: 'So\'rovnoma muvaffaqiyatli yaratildi',
      applicationForm,
    });
  } catch (error) {
    console.error('Create application form error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri ID format',
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu vakansiya uchun so\'rovnoma allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Application Forms
const getAllApplicationForms = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { vacancyId, status } = req.query;

    const query = { companyId };
    if (vacancyId) {
      query.vacancyId = vacancyId;
    }
    if (status) {
      query.status = status;
    }

    const forms = await ApplicationForm.find(query)
      .populate('vacancyId', 'nom')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: forms.length,
      forms,
    });
  } catch (error) {
    console.error('Get all application forms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Application Form
const getApplicationForm = async (req, res) => {
  try {
    const companyId = req.company._id;
    const form = await ApplicationForm.findOne({
      _id: req.params.id,
      companyId,
    }).populate('vacancyId', 'nom');

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'So\'rovnoma topilmadi',
      });
    }

    res.json({
      success: true,
      form,
    });
  } catch (error) {
    console.error('Get application form error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri so\'rovnoma ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Application Form by Vacancy ID (Public - no auth)
const getApplicationFormByVacancyId = async (req, res) => {
  try {
    const { vacancyId } = req.params;
    const form = await ApplicationForm.findOne({
      vacancyId,
      status: 'active',
    }).populate('vacancyId', 'nom');

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'So\'rovnoma topilmadi',
      });
    }

    res.json({
      success: true,
      form,
    });
  } catch (error) {
    console.error('Get application form by vacancy ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri vakansiya ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Application Form
const updateApplicationForm = async (req, res) => {
  try {
    const { nom, questions, status } = req.body;
    const companyId = req.company._id;

    const form = await ApplicationForm.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'So\'rovnoma topilmadi',
      });
    }

    // Update nom
    if (nom !== undefined) {
      form.nom = nom;
    }

    // Update questions if provided
    if (questions !== undefined) {
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Kamida bitta savol bo\'lishi kerak',
        });
      }

      // Validate each question
      const validTypes = ['text', 'textarea', 'number', 'email', 'phone', 'select', 'radio', 'checkbox', 'date', 'file'];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.type) {
          return res.status(400).json({
            success: false,
            message: `Savol ${i + 1}: question va type maydonlari majburiy`,
          });
        }
        if (!validTypes.includes(q.type)) {
          return res.status(400).json({
            success: false,
            message: `Savol ${i + 1}: Noto'g'ri type. Qabul qilinadigan turlar: ${validTypes.join(', ')}`,
          });
        }
        if (['select', 'radio', 'checkbox'].includes(q.type)) {
          if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
            return res.status(400).json({
              success: false,
              message: `Savol ${i + 1}: ${q.type} turi uchun options majburiy va kamida bitta variant bo'lishi kerak`,
            });
          }
        }
        if (q.order === undefined) {
          q.order = i;
        }
        // Placeholder bo'sh bo'lsa undefined ga o'zgartirish
        if (q.placeholder !== undefined && q.placeholder === '') {
          q.placeholder = undefined;
        }
      }
      form.questions = questions;
    }

    await form.save();

    // Populate references
    await form.populate('vacancyId', 'nom');

    res.json({
      success: true,
      message: 'So\'rovnoma muvaffaqiyatli yangilandi',
      form,
    });
  } catch (error) {
    console.error('Update application form error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri so\'rovnoma ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Application Form Status
const updateApplicationFormStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const companyId = req.company._id;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "active" yoki "inactive" bo\'lishi kerak',
      });
    }

    const form = await ApplicationForm.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'So\'rovnoma topilmadi',
      });
    }

    form.status = status;
    await form.save();

    // Populate references
    await form.populate('vacancyId', 'nom');

    res.json({
      success: true,
      message: 'So\'rovnoma status muvaffaqiyatli yangilandi',
      form,
    });
  } catch (error) {
    console.error('Update application form status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri so\'rovnoma ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Application Form
const deleteApplicationForm = async (req, res) => {
  try {
    const companyId = req.company._id;
    const form = await ApplicationForm.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'So\'rovnoma topilmadi',
      });
    }

    await ApplicationForm.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'So\'rovnoma muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete application form error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri so\'rovnoma ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createApplicationForm,
  getAllApplicationForms,
  getApplicationForm,
  getApplicationFormByVacancyId,
  updateApplicationForm,
  updateApplicationFormStatus,
  deleteApplicationForm,
};

