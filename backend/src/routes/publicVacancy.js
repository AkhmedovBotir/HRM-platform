const express = require('express');
const router = express.Router();
const {
  getAllVacancies,
  getVacancy,
  getVacancyStats,
} = require('../controllers/publicVacancyController');

// Get all vacancies with filters (public, no authentication)
router.get('/', getAllVacancies);

// Get vacancy statistics (public, no authentication)
router.get('/stats', getVacancyStats);

// Get single vacancy (public, no authentication)
router.get('/:id', getVacancy);

module.exports = router;





