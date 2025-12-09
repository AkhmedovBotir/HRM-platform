const WorkScheduleTemplate = require('../models/WorkScheduleTemplate');

// Create Work Schedule Template
const createTemplate = async (req, res) => {
  try {
    const {
      nom,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      status,
    } = req.body;
    const companyId = req.company._id;

    // Check if template with same nom exists in this company
    const existingTemplate = await WorkScheduleTemplate.findOne({
      companyId,
      nom,
    });

    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan shablon allaqachon mavjud',
      });
    }

    const template = new WorkScheduleTemplate({
      companyId,
      nom,
      monday: monday || { startTime: null, endTime: null, isWorking: false },
      tuesday: tuesday || { startTime: null, endTime: null, isWorking: false },
      wednesday: wednesday || { startTime: null, endTime: null, isWorking: false },
      thursday: thursday || { startTime: null, endTime: null, isWorking: false },
      friday: friday || { startTime: null, endTime: null, isWorking: false },
      saturday: saturday || { startTime: null, endTime: null, isWorking: false },
      sunday: sunday || { startTime: null, endTime: null, isWorking: false },
      status: status || 'active',
    });

    await template.save();

    res.status(201).json({
      success: true,
      message: 'Ish grafik shablon muvaffaqiyatli yaratildi',
      template: {
        id: template._id,
        companyId: template.companyId,
        nom: template.nom,
        monday: template.monday,
        tuesday: template.tuesday,
        wednesday: template.wednesday,
        thursday: template.thursday,
        friday: template.friday,
        saturday: template.saturday,
        sunday: template.sunday,
        status: template.status,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create template error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan shablon allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Templates
const getAllTemplates = async (req, res) => {
  try {
    const companyId = req.company._id;
    const templates = await WorkScheduleTemplate.find({ companyId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error) {
    console.error('Get all templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Template
const getTemplate = async (req, res) => {
  try {
    const companyId = req.company._id;
    const template = await WorkScheduleTemplate.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Shablon topilmadi',
      });
    }

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Get template error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri shablon ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Template
const updateTemplate = async (req, res) => {
  try {
    const {
      nom,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    } = req.body;
    const companyId = req.company._id;

    const template = await WorkScheduleTemplate.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Shablon topilmadi',
      });
    }

    // Check if nom is being changed and if it conflicts with existing
    if (nom && nom !== template.nom) {
      const existingByNom = await WorkScheduleTemplate.findOne({
        companyId,
        nom,
      });
      if (existingByNom) {
        return res.status(400).json({
          success: false,
          message: 'Bu nom bilan shablon mavjud',
        });
      }
    }

    // Update fields
    if (nom) template.nom = nom;
    if (monday) template.monday = monday;
    if (tuesday) template.tuesday = tuesday;
    if (wednesday) template.wednesday = wednesday;
    if (thursday) template.thursday = thursday;
    if (friday) template.friday = friday;
    if (saturday) template.saturday = saturday;
    if (sunday) template.sunday = sunday;

    await template.save();

    res.json({
      success: true,
      message: 'Shablon muvaffaqiyatli yangilandi',
      template: {
        id: template._id,
        companyId: template.companyId,
        nom: template.nom,
        monday: template.monday,
        tuesday: template.tuesday,
        wednesday: template.wednesday,
        thursday: template.thursday,
        friday: template.friday,
        saturday: template.saturday,
        sunday: template.sunday,
        status: template.status,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update template error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri shablon ID',
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan shablon allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Template Status
const updateTemplateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const companyId = req.company._id;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "active" yoki "inactive" bo\'lishi kerak',
      });
    }

    const template = await WorkScheduleTemplate.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Shablon topilmadi',
      });
    }

    template.status = status;
    await template.save();

    res.json({
      success: true,
      message: 'Shablon status muvaffaqiyatli yangilandi',
      template: {
        id: template._id,
        companyId: template.companyId,
        nom: template.nom,
        status: template.status,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update template status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri shablon ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Template
const deleteTemplate = async (req, res) => {
  try {
    const companyId = req.company._id;
    const template = await WorkScheduleTemplate.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Shablon topilmadi',
      });
    }

    await WorkScheduleTemplate.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Shablon muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete template error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri shablon ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplate,
  updateTemplate,
  updateTemplateStatus,
  deleteTemplate,
};






