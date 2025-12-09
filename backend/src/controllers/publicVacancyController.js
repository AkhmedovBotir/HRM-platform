const Vacancy = require('../models/Vacancy');
const Department = require('../models/Department');
const Position = require('../models/Position');
const WorkScheduleTemplate = require('../models/WorkScheduleTemplate');
const Company = require('../models/Company');

// Get All Vacancies with Filters
const getAllVacancies = async (req, res) => {
  try {
    const {
      // Status filter
      status,
      // Type filter
      type,
      // ID filters
      companyId,
      departmentId,
      positionId,
      workScheduleId,
      // Text search filters
      daraja,
      nom,
      oylik,
      // Skills filter (array ichida qidirish)
      skills,
      // Application count range
      minApplicationCount,
      maxApplicationCount,
      // Age range filters
      minAge,
      maxAge,
      // Date range filters
      createdAtFrom,
      createdAtTo,
      updatedAtFrom,
      updatedAtTo,
      // Pagination
      page = 1,
      limit = 10,
      // Sort
      sortBy = 'createdAt',
      sortOrder = 'desc', // 'asc' or 'desc'
    } = req.query;

    // Build query object
    const query = {};

    // Status filter
    if (status) {
      if (['active', 'close'].includes(status)) {
        query.status = status;
      }
    }

    // Type filter
    if (type) {
      if (['fulltime', 'parttime'].includes(type)) {
        query.type = type;
      }
    }

    // Company ID filter
    if (companyId) {
      query.companyId = companyId;
    }

    // Department ID filter
    if (departmentId) {
      query.departmentId = departmentId;
    }

    // Position ID filter
    if (positionId) {
      query.positionId = positionId;
    }

    // Work Schedule ID filter
    if (workScheduleId) {
      query.workScheduleId = workScheduleId;
    }

    // Daraja text search (case-insensitive)
    if (daraja) {
      query.daraja = { $regex: daraja, $options: 'i' };
    }

    // Nom text search (case-insensitive)
    if (nom) {
      query.nom = { $regex: nom, $options: 'i' };
    }

    // Oylik text search (case-insensitive)
    if (oylik) {
      query.oylik = { $regex: oylik, $options: 'i' };
    }

    // Skills filter - array ichida qidirish
    if (skills) {
      // Agar skills comma-separated string bo'lsa
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      query.skills = { $in: skillsArray.map(skill => skill.trim()) };
    }

    // Application count range
    if (minApplicationCount !== undefined || maxApplicationCount !== undefined) {
      query.applicationCount = {};
      if (minApplicationCount !== undefined) {
        query.applicationCount.$gte = parseInt(minApplicationCount);
      }
      if (maxApplicationCount !== undefined) {
        query.applicationCount.$lte = parseInt(maxApplicationCount);
      }
    }

    // Age range filters
    // Foydalanuvchi yosh oralig'ini qidirsa, vakansiyalardagi yosh chegaralari bilan kesishishi kerak
    if (minAge !== undefined || maxAge !== undefined) {
      const userMinAge = minAge !== undefined ? parseInt(minAge) : 0;
      const userMaxAge = maxAge !== undefined ? parseInt(maxAge) : 100;
      
      // Vakansiyalar qaytarilishi kerak agar:
      // 1. Vakansiyada yosh chegarasi yo'q (hech qanday cheklov yo'q)
      // 2. Vakansiyadagi yosh oralig'i foydalanuvchi yosh oralig'i bilan kesishadi
      query.$or = [
        // Yosh chegarasi yo'q vakansiyalar
        { minAge: { $exists: false }, maxAge: { $exists: false } },
        // Faqat minAge bor
        { minAge: { $exists: true }, maxAge: { $exists: false }, minAge: { $lte: userMaxAge } },
        // Faqat maxAge bor
        { minAge: { $exists: false }, maxAge: { $exists: true }, maxAge: { $gte: userMinAge } },
        // Ikkalasi ham bor va oralig'lar kesishadi
        {
          minAge: { $exists: true },
          maxAge: { $exists: true },
          $and: [
            { minAge: { $lte: userMaxAge } },
            { maxAge: { $gte: userMinAge } },
          ],
        },
      ];
    }

    // Date range filters
    if (createdAtFrom || createdAtTo) {
      query.createdAt = {};
      if (createdAtFrom) {
        query.createdAt.$gte = new Date(createdAtFrom);
      }
      if (createdAtTo) {
        query.createdAt.$lte = new Date(createdAtTo);
      }
    }

    if (updatedAtFrom || updatedAtTo) {
      query.updatedAt = {};
      if (updatedAtFrom) {
        query.updatedAt.$gte = new Date(updatedAtFrom);
      }
      if (updatedAtTo) {
        query.updatedAt.$lte = new Date(updatedAtTo);
      }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOptions = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'applicationCount', 'nom', 'daraja', 'oylik'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    sortOptions[sortField] = sortDirection;

    // Execute query
    const vacancies = await Vacancy.find(query)
      .populate('companyId', 'nom INN')
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom')
      .populate('workScheduleId', 'nom')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Vacancy.countDocuments(query);

    res.json({
      success: true,
      count: vacancies.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
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
    const vacancy = await Vacancy.findById(req.params.id)
      .populate('companyId', 'nom INN kompaniyaEgasi kompaniyaTelefon')
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom')
      .populate('workScheduleId', 'nom monday tuesday wednesday thursday friday saturday sunday');

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

// Get Vacancy Statistics
const getVacancyStats = async (req, res) => {
  try {
    const stats = await Vacancy.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          closed: {
            $sum: { $cond: [{ $eq: ['$status', 'close'] }, 1, 0] }
          },
          fulltime: {
            $sum: { $cond: [{ $eq: ['$type', 'fulltime'] }, 1, 0] }
          },
          parttime: {
            $sum: { $cond: [{ $eq: ['$type', 'parttime'] }, 1, 0] }
          },
          totalApplications: { $sum: '$applicationCount' },
          avgApplications: { $avg: '$applicationCount' },
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        total: 0,
        active: 0,
        closed: 0,
        fulltime: 0,
        parttime: 0,
        totalApplications: 0,
        avgApplications: 0,
      },
    });
  } catch (error) {
    console.error('Get vacancy stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getAllVacancies,
  getVacancy,
  getVacancyStats,
};

