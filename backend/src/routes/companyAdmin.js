const express = require('express');
const router = express.Router();
const {
  createCompanyAdmin,
  getAllCompanyAdmins,
  getCompanyAdmin,
  updateCompanyAdmin,
  updateCompanyAdminStatus,
  deleteCompanyAdmin,
} = require('../controllers/companyAdminController');
const {
  validateCreateCompanyAdmin,
  validateUpdateCompanyAdmin,
  validateUpdateStatus,
} = require('../validators/companyAdminValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create company admin
router.post('/', validateCreateCompanyAdmin, createCompanyAdmin);

// Get all company admins
router.get('/', getAllCompanyAdmins);

// Get single company admin
router.get('/:id', getCompanyAdmin);

// Update company admin
router.put('/:id', validateUpdateCompanyAdmin, updateCompanyAdmin);

// Update company admin status
router.patch('/:id/status', validateUpdateStatus, updateCompanyAdminStatus);

// Delete company admin
router.delete('/:id', deleteCompanyAdmin);

module.exports = router;







