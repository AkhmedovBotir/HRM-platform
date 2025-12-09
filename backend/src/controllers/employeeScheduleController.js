const EmployeeSchedule = require('../models/EmployeeSchedule');
const Employee = require('../models/Employee');
const WorkScheduleTemplate = require('../models/WorkScheduleTemplate');

// Create Employee Schedule
const createEmployeeSchedule = async (req, res) => {
  try {
    const { employeeId, templateId, startDate, endDate, status } = req.body;
    const companyId = req.company._id;

    // Verify employee belongs to company
    const employee = await Employee.findOne({
      _id: employeeId,
      companyId,
    });

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: 'Xodim topilmadi yoki bu kompaniyaga tegishli emas',
      });
    }

    // Verify template belongs to company
    const template = await WorkScheduleTemplate.findOne({
      _id: templateId,
      companyId,
    });

    if (!template) {
      return res.status(400).json({
        success: false,
        message: 'Shablon topilmadi yoki bu kompaniyaga tegishli emas',
      });
    }

    const employeeSchedule = new EmployeeSchedule({
      companyId,
      employeeId,
      templateId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status: status || 'active',
    });

    await employeeSchedule.save();

    await employeeSchedule.populate('employeeId', 'firstName lastName middleName');
    await employeeSchedule.populate('templateId', 'nom');

    res.status(201).json({
      success: true,
      message: 'Xodim grafigi muvaffaqiyatli yaratildi',
      schedule: {
        id: employeeSchedule._id,
        companyId: employeeSchedule.companyId,
        employeeId: employeeSchedule.employeeId._id,
        employeeName: `${employeeSchedule.employeeId.firstName} ${employeeSchedule.employeeId.lastName} ${employeeSchedule.employeeId.middleName}`,
        templateId: employeeSchedule.templateId._id,
        templateName: employeeSchedule.templateId.nom,
        startDate: employeeSchedule.startDate,
        endDate: employeeSchedule.endDate,
        status: employeeSchedule.status,
        createdAt: employeeSchedule.createdAt,
        updatedAt: employeeSchedule.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create employee schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Employee Schedules
const getAllEmployeeSchedules = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { employeeId, templateId, startDate, endDate, status } = req.query;

    // Build query
    const query = { companyId };

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (templateId) {
      query.templateId = templateId;
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startDate.$lte = new Date(endDate);
      }
    }

    if (status) {
      query.status = status;
    }

    const schedules = await EmployeeSchedule.find(query)
      .populate('employeeId', 'firstName lastName middleName')
      .populate('templateId', 'nom')
      .sort({ startDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    console.error('Get all employee schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Employee Schedule
const getEmployeeSchedule = async (req, res) => {
  try {
    const companyId = req.company._id;
    const schedule = await EmployeeSchedule.findOne({
      _id: req.params.id,
      companyId,
    })
      .populate('employeeId', 'firstName lastName middleName')
      .populate('templateId', 'nom monday tuesday wednesday thursday friday saturday sunday');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Xodim grafigi topilmadi',
      });
    }

    res.json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error('Get employee schedule error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri grafik ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Employee Schedule
const updateEmployeeSchedule = async (req, res) => {
  try {
    const { templateId, startDate, endDate } = req.body;
    const companyId = req.company._id;

    const schedule = await EmployeeSchedule.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Xodim grafigi topilmadi',
      });
    }

    // Verify template if being changed
    if (templateId && templateId.toString() !== schedule.templateId.toString()) {
      const template = await WorkScheduleTemplate.findOne({
        _id: templateId,
        companyId,
      });

      if (!template) {
        return res.status(400).json({
          success: false,
          message: 'Shablon topilmadi yoki bu kompaniyaga tegishli emas',
        });
      }
    }

    // Update fields
    if (templateId) schedule.templateId = templateId;
    if (startDate) schedule.startDate = new Date(startDate);
    if (endDate !== undefined) schedule.endDate = endDate ? new Date(endDate) : null;

    await schedule.save();

    await schedule.populate('employeeId', 'firstName lastName middleName');
    await schedule.populate('templateId', 'nom');

    res.json({
      success: true,
      message: 'Xodim grafigi muvaffaqiyatli yangilandi',
      schedule: {
        id: schedule._id,
        companyId: schedule.companyId,
        employeeId: schedule.employeeId._id,
        employeeName: `${schedule.employeeId.firstName} ${schedule.employeeId.lastName} ${schedule.employeeId.middleName}`,
        templateId: schedule.templateId._id,
        templateName: schedule.templateId.nom,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        status: schedule.status,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update employee schedule error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri grafik ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Employee Schedule Status
const updateEmployeeScheduleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const companyId = req.company._id;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "active" yoki "inactive" bo\'lishi kerak',
      });
    }

    const schedule = await EmployeeSchedule.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Xodim grafigi topilmadi',
      });
    }

    schedule.status = status;
    await schedule.save();

    await schedule.populate('employeeId', 'firstName lastName middleName');
    await schedule.populate('templateId', 'nom');

    res.json({
      success: true,
      message: 'Xodim grafigi status muvaffaqiyatli yangilandi',
      schedule: {
        id: schedule._id,
        companyId: schedule.companyId,
        employeeId: schedule.employeeId._id,
        employeeName: `${schedule.employeeId.firstName} ${schedule.employeeId.lastName} ${schedule.employeeId.middleName}`,
        templateId: schedule.templateId._id,
        templateName: schedule.templateId.nom,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        status: schedule.status,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update employee schedule status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri grafik ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Employee Schedule
const deleteEmployeeSchedule = async (req, res) => {
  try {
    const companyId = req.company._id;
    const schedule = await EmployeeSchedule.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Xodim grafigi topilmadi',
      });
    }

    await EmployeeSchedule.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Xodim grafigi muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete employee schedule error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri grafik ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createEmployeeSchedule,
  getAllEmployeeSchedules,
  getEmployeeSchedule,
  updateEmployeeSchedule,
  updateEmployeeScheduleStatus,
  deleteEmployeeSchedule,
};






