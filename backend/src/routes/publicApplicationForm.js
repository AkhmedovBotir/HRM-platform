const express = require('express');
const router = express.Router();
const {
  getApplicationFormByVacancyId,
} = require('../controllers/applicationFormController');

// Get application form by vacancy ID (public, no authentication)
router.get('/vacancy/:vacancyId', getApplicationFormByVacancyId);

module.exports = router;





