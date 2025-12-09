const Position = require('../models/Position');

// Create Position
const createPosition = async (req, res) => {
  try {
    const { nom, status } = req.body;
    const companyId = req.company._id;

    // Check if position with same nom exists in this company
    const existingPosition = await Position.findOne({
      companyId,
      nom,
    });

    if (existingPosition) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan lavozim allaqachon mavjud',
      });
    }

    const position = new Position({
      companyId,
      nom,
      status: status || 'active',
    });

    await position.save();

    res.status(201).json({
      success: true,
      message: 'Lavozim muvaffaqiyatli yaratildi',
      position: {
        id: position._id,
        companyId: position.companyId,
        nom: position.nom,
        status: position.status,
        createdAt: position.createdAt,
        updatedAt: position.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create position error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan lavozim allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Positions
const getAllPositions = async (req, res) => {
  try {
    const companyId = req.company._id;
    const positions = await Position.find({ companyId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: positions.length,
      positions,
    });
  } catch (error) {
    console.error('Get all positions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Position
const getPosition = async (req, res) => {
  try {
    const companyId = req.company._id;
    const position = await Position.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Lavozim topilmadi',
      });
    }

    res.json({
      success: true,
      position,
    });
  } catch (error) {
    console.error('Get position error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri lavozim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Position
const updatePosition = async (req, res) => {
  try {
    const { nom } = req.body;
    const companyId = req.company._id;

    const position = await Position.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Lavozim topilmadi',
      });
    }

    // Check if nom is being changed and if it conflicts with existing
    if (nom && nom !== position.nom) {
      const existingByNom = await Position.findOne({
        companyId,
        nom,
      });
      if (existingByNom) {
        return res.status(400).json({
          success: false,
          message: 'Bu nom bilan lavozim mavjud',
        });
      }
    }

    // Update fields
    if (nom) position.nom = nom;

    await position.save();

    res.json({
      success: true,
      message: 'Lavozim muvaffaqiyatli yangilandi',
      position: {
        id: position._id,
        companyId: position.companyId,
        nom: position.nom,
        status: position.status,
        createdAt: position.createdAt,
        updatedAt: position.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update position error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri lavozim ID',
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu nom bilan lavozim allaqachon mavjud',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Position Status
const updatePositionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const companyId = req.company._id;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "active" yoki "inactive" bo\'lishi kerak',
      });
    }

    const position = await Position.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Lavozim topilmadi',
      });
    }

    position.status = status;
    await position.save();

    res.json({
      success: true,
      message: 'Lavozim status muvaffaqiyatli yangilandi',
      position: {
        id: position._id,
        companyId: position.companyId,
        nom: position.nom,
        status: position.status,
        createdAt: position.createdAt,
        updatedAt: position.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update position status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri lavozim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Position
const deletePosition = async (req, res) => {
  try {
    const companyId = req.company._id;
    const position = await Position.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Lavozim topilmadi',
      });
    }

    await Position.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lavozim muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete position error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri lavozim ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createPosition,
  getAllPositions,
  getPosition,
  updatePosition,
  updatePositionStatus,
  deletePosition,
};







