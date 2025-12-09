const express = require('express');
const router = express.Router();
const {
  submitApplication,
} = require('../controllers/applicationSubmissionController');
const {
  validateSubmitApplication,
} = require('../validators/applicationSubmissionValidator');

// Submit application (public, no authentication)
router.post('/', validateSubmitApplication, submitApplication);

module.exports = router;





