const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment,
} = require('../controllers/departmentController');
const {
  validateCreateDepartment,
  validateUpdateDepartment,
  validateUpdateStatus,
} = require('../validators/departmentValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create department
router.post('/', validateCreateDepartment, createDepartment);

// Get all departments
router.get('/', getAllDepartments);

// Get single department
router.get('/:id', getDepartment);

// Update department
router.put('/:id', validateUpdateDepartment, updateDepartment);

// Update department status
router.patch('/:id/status', validateUpdateStatus, updateDepartmentStatus);

// Delete department
router.delete('/:id', deleteDepartment);

module.exports = router;







