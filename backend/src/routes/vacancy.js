const express = require('express');
const router = express.Router();
const {
  createVacancy,
  getAllVacancies,
  getVacancy,
  updateVacancy,
  updateVacancyStatus,
  updateApplicationCount,
  deleteVacancy,
} = require('../controllers/vacancyController');
const {
  validateCreateVacancy,
  validateUpdateVacancy,
  validateUpdateStatus,
  validateUpdateApplicationCount,
} = require('../validators/vacancyValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create vacancy
router.post('/', validateCreateVacancy, createVacancy);

// Get all vacancies
router.get('/', getAllVacancies);

// Get single vacancy
router.get('/:id', getVacancy);

// Update vacancy
router.put('/:id', validateUpdateVacancy, updateVacancy);

// Update vacancy status
router.patch('/:id/status', validateUpdateStatus, updateVacancyStatus);

// Update application count
router.patch('/:id/application-count', validateUpdateApplicationCount, updateApplicationCount);

// Delete vacancy
router.delete('/:id', deleteVacancy);

module.exports = router;





