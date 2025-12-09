const express = require('express');
const router = express.Router();
const {
  createPosition,
  getAllPositions,
  getPosition,
  updatePosition,
  updatePositionStatus,
  deletePosition,
} = require('../controllers/positionController');
const {
  validateCreatePosition,
  validateUpdatePosition,
  validateUpdateStatus,
} = require('../validators/positionValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create position
router.post('/', validateCreatePosition, createPosition);

// Get all positions
router.get('/', getAllPositions);

// Get single position
router.get('/:id', getPosition);

// Update position
router.put('/:id', validateUpdatePosition, updatePosition);

// Update position status
router.patch('/:id/status', validateUpdateStatus, updatePositionStatus);

// Delete position
router.delete('/:id', deletePosition);

module.exports = router;







