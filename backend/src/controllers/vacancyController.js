const Vacancy = require('../models/Vacancy');
const Department = require('../models/Department');
const Position = require('../models/Position');
const WorkScheduleTemplate = require('../models/WorkScheduleTemplate');

// Create Vacancy
const createVacancy = async (req, res) => {
  try {
    const {
      nom,
      departmentId,
      positionId,
      daraja,
      type,
      workScheduleId,
      oylik,
      description,
      responsibilities,
      preferences,
      skills,
      status,
      minAge,
      maxAge,
    } = req.body;
    const companyId = req.company._id;

    // Validate that department belongs to company
    const department = await Department.findOne({
      _id: departmentId,
      companyId,
    });
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Bo\'lim topilmadi yoki sizning kompaniyangizga tegishli emas',
      });
    }

    // Validate that position belongs to company
    const position = await Position.findOne({
      _id: positionId,
      companyId,
    });
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Lavozim topilmadi yoki sizning kompaniyangizga tegishli emas',
      });
    }

    // Validate that work schedule belongs to company
    const workSchedule = await WorkScheduleTemplate.findOne({
      _id: workScheduleId,
      companyId,
    });
    if (!workSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Ish grafik topilmadi yoki sizning kompaniyangizga tegishli emas',
      });
    }

    const vacancy = new Vacancy({
      companyId,
      nom,
      departmentId,
      positionId,
      daraja,
      type,
      workScheduleId,
      oylik,
      description,
      responsibilities,
      preferences,
      skills: skills || [],
      status: status || 'active',
      applicationCount: 0,
      minAge,
      maxAge,
    });

    await vacancy.save();

    // Populate references for response
    await vacancy.populate('departmentId', 'nom');
    await vacancy.populate('positionId', 'nom');
    await vacancy.populate('workScheduleId', 'nom');

    res.status(201).json({
      success: true,
      message: 'Vakansiya muvaffaqiyatli yaratildi',
      vacancy,
    });
  } catch (error) {
    console.error('Create vacancy error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Vacancies
const getAllVacancies = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { status } = req.query;

    const query = { companyId };
    if (status) {
      query.status = status;
    }

    const vacancies = await Vacancy.find(query)
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom')
      .populate('workScheduleId', 'nom')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vacancies.length,
      vacancies,
    });
  } catch (error) {
    console.error('Get all vacancies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Vacancy
const getVacancy = async (req, res) => {
  try {
    const companyId = req.company._id;
    const vacancy = await Vacancy.findOne({
      _id: req.params.id,
      companyId,
    })
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom')
      .populate('workScheduleId', 'nom');

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vakansiya topilmadi',
      });
    }

    res.json({
      success: true,
      vacancy,
    });
  } catch (error) {
    console.error('Get vacancy error:', error);
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

// Update Vacancy
const updateVacancy = async (req, res) => {
  try {
    const {
      nom,
      departmentId,
      positionId,
      daraja,
      type,
      workScheduleId,
      oylik,
      description,
      responsibilities,
      preferences,
      skills,
      minAge,
      maxAge,
    } = req.body;
    const companyId = req.company._id;

    const vacancy = await Vacancy.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vakansiya topilmadi',
      });
    }

    // Validate department if provided
    if (departmentId) {
      const department = await Department.findOne({
        _id: departmentId,
        companyId,
      });
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Bo\'lim topilmadi yoki sizning kompaniyangizga tegishli emas',
        });
      }
      vacancy.departmentId = departmentId;
    }

    // Validate position if provided
    if (positionId) {
      const position = await Position.findOne({
        _id: positionId,
        companyId,
      });
      if (!position) {
        return res.status(404).json({
          success: false,
          message: 'Lavozim topilmadi yoki sizning kompaniyangizga tegishli emas',
        });
      }
      vacancy.positionId = positionId;
    }

    // Validate work schedule if provided
    if (workScheduleId) {
      const workSchedule = await WorkScheduleTemplate.findOne({
        _id: workScheduleId,
        companyId,
      });
      if (!workSchedule) {
        return res.status(404).json({
          success: false,
          message: 'Ish grafik topilmadi yoki sizning kompaniyangizga tegishli emas',
        });
      }
      vacancy.workScheduleId = workScheduleId;
    }

    // Update other fields
    if (nom !== undefined) vacancy.nom = nom;
    if (daraja !== undefined) vacancy.daraja = daraja;
    if (type !== undefined) vacancy.type = type;
    if (oylik !== undefined) vacancy.oylik = oylik;
    if (description !== undefined) vacancy.description = description;
    if (responsibilities !== undefined) vacancy.responsibilities = responsibilities;
    if (preferences !== undefined) vacancy.preferences = preferences;
    if (skills !== undefined) vacancy.skills = skills;
    if (minAge !== undefined) vacancy.minAge = minAge;
    if (maxAge !== undefined) vacancy.maxAge = maxAge;

    await vacancy.save();

    // Populate references for response
    await vacancy.populate('departmentId', 'nom');
    await vacancy.populate('positionId', 'nom');
    await vacancy.populate('workScheduleId', 'nom');

    res.json({
      success: true,
      message: 'Vakansiya muvaffaqiyatli yangilandi',
      vacancy,
    });
  } catch (error) {
    console.error('Update vacancy error:', error);
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

// Update Vacancy Status
const updateVacancyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const companyId = req.company._id;

    if (!status || !['active', 'close'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "active" yoki "close" bo\'lishi kerak',
      });
    }

    const vacancy = await Vacancy.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vakansiya topilmadi',
      });
    }

    vacancy.status = status;
    await vacancy.save();

    // Populate references for response
    await vacancy.populate('departmentId', 'nom');
    await vacancy.populate('positionId', 'nom');
    await vacancy.populate('workScheduleId', 'nom');

    res.json({
      success: true,
      message: 'Vakansiya status muvaffaqiyatli yangilandi',
      vacancy,
    });
  } catch (error) {
    console.error('Update vacancy status error:', error);
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

// Update Application Count
const updateApplicationCount = async (req, res) => {
  try {
    const { applicationCount } = req.body;
    const companyId = req.company._id;

    if (applicationCount === undefined || typeof applicationCount !== 'number' || applicationCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Application count 0 yoki undan katta son bo\'lishi kerak',
      });
    }

    const vacancy = await Vacancy.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vakansiya topilmadi',
      });
    }

    vacancy.applicationCount = applicationCount;
    await vacancy.save();

    // Populate references for response
    await vacancy.populate('departmentId', 'nom');
    await vacancy.populate('positionId', 'nom');
    await vacancy.populate('workScheduleId', 'nom');

    res.json({
      success: true,
      message: 'Ariza soni muvaffaqiyatli yangilandi',
      vacancy,
    });
  } catch (error) {
    console.error('Update application count error:', error);
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

// Delete Vacancy
const deleteVacancy = async (req, res) => {
  try {
    const companyId = req.company._id;
    const vacancy = await Vacancy.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vakansiya topilmadi',
      });
    }

    await Vacancy.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vakansiya muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete vacancy error:', error);
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

module.exports = {
  createVacancy,
  getAllVacancies,
  getVacancy,
  updateVacancy,
  updateVacancyStatus,
  updateApplicationCount,
  deleteVacancy,
};

