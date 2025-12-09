const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Create or Update Attendance
const createOrUpdateAttendance = async (req, res) => {
  try {
    const { employeeId, date, checkIn, checkOut, status, notes } = req.body;
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

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      companyId,
      employeeId,
      date: new Date(date),
    });

    if (existingAttendance) {
      // Update existing attendance
      if (checkIn) existingAttendance.checkIn = new Date(checkIn);
      if (checkOut) existingAttendance.checkOut = new Date(checkOut);
      if (status) existingAttendance.status = status;
      if (notes !== undefined) existingAttendance.notes = notes;

      await existingAttendance.save();

      await existingAttendance.populate('employeeId', 'firstName lastName middleName');

      return res.json({
        success: true,
        message: 'Davomat muvaffaqiyatli yangilandi',
        attendance: {
          id: existingAttendance._id,
          companyId: existingAttendance.companyId,
          employeeId: existingAttendance.employeeId._id,
          employeeName: `${existingAttendance.employeeId.firstName} ${existingAttendance.employeeId.lastName} ${existingAttendance.employeeId.middleName}`,
          date: existingAttendance.date,
          checkIn: existingAttendance.checkIn,
          checkOut: existingAttendance.checkOut,
          status: existingAttendance.status,
          notes: existingAttendance.notes,
          createdAt: existingAttendance.createdAt,
          updatedAt: existingAttendance.updatedAt,
        },
      });
    }

    // Create new attendance
    const attendance = new Attendance({
      companyId,
      employeeId,
      date: new Date(date),
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      status: status || 'absent',
      notes: notes || '',
    });

    await attendance.save();

    await attendance.populate('employeeId', 'firstName lastName middleName');

    res.status(201).json({
      success: true,
      message: 'Davomat muvaffaqiyatli yaratildi',
      attendance: {
        id: attendance._id,
        companyId: attendance.companyId,
        employeeId: attendance.employeeId._id,
        employeeName: `${attendance.employeeId.firstName} ${attendance.employeeId.lastName} ${attendance.employeeId.middleName}`,
        date: attendance.date,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status,
        notes: attendance.notes,
        createdAt: attendance.createdAt,
        updatedAt: attendance.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create/Update attendance error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu sana uchun davomat allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Attendances
const getAllAttendances = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { employeeId, startDate, endDate, status } = req.query;

    // Build query
    const query = { companyId };

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    if (status) {
      query.status = status;
    }

    const attendances = await Attendance.find(query)
      .populate('employeeId', 'firstName lastName middleName')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: attendances.length,
      attendances,
    });
  } catch (error) {
    console.error('Get all attendances error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Attendance
const getAttendance = async (req, res) => {
  try {
    const companyId = req.company._id;
    const attendance = await Attendance.findOne({
      _id: req.params.id,
      companyId,
    }).populate('employeeId', 'firstName lastName middleName');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Davomat topilmadi',
      });
    }

    res.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri davomat ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Attendance
const updateAttendance = async (req, res) => {
  try {
    const { checkIn, checkOut, status, notes } = req.body;
    const companyId = req.company._id;

    const attendance = await Attendance.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Davomat topilmadi',
      });
    }

    // Update fields
    if (checkIn !== undefined) attendance.checkIn = checkIn ? new Date(checkIn) : null;
    if (checkOut !== undefined) attendance.checkOut = checkOut ? new Date(checkOut) : null;
    if (status) attendance.status = status;
    if (notes !== undefined) attendance.notes = notes;

    await attendance.save();

    await attendance.populate('employeeId', 'firstName lastName middleName');

    res.json({
      success: true,
      message: 'Davomat muvaffaqiyatli yangilandi',
      attendance: {
        id: attendance._id,
        companyId: attendance.companyId,
        employeeId: attendance.employeeId._id,
        employeeName: `${attendance.employeeId.firstName} ${attendance.employeeId.lastName} ${attendance.employeeId.middleName}`,
        date: attendance.date,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status,
        notes: attendance.notes,
        createdAt: attendance.createdAt,
        updatedAt: attendance.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri davomat ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Attendance
const deleteAttendance = async (req, res) => {
  try {
    const companyId = req.company._id;
    const attendance = await Attendance.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Davomat topilmadi',
      });
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Davomat muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete attendance error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri davomat ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createOrUpdateAttendance,
  getAllAttendances,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};







