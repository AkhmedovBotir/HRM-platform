const express = require('express');
const router = express.Router();
const {
  createInterview,
  getAllInterviews,
  getInterview,
  getInterviewByApplicationId,
  addStage,
  startStage,
  completeStage,
  updateStage,
  makeFinalDecision,
  updateResponseStatus,
  cancelInterview,
  deleteInterview,
  hireAsEmployee,
} = require('../controllers/interviewController');
const authenticateCompany = require('../middlewares/companyAuth');

router.use(authenticateCompany);

// CRUD
router.post('/', createInterview);
router.get('/', getAllInterviews);
router.get('/application/:applicationSubmissionId', getInterviewByApplicationId);
router.get('/:id', getInterview);
router.delete('/:id', deleteInterview);

// Bosqichlar bilan ishlash
router.post('/:id/stage', addStage);
router.patch('/:id/stage/:stageId', updateStage);
router.patch('/:id/start', startStage);
router.patch('/:id/complete', completeStage);

// Yakuniy qarorlar
router.patch('/:id/decision', makeFinalDecision);
router.patch('/:id/response', updateResponseStatus);
router.patch('/:id/cancel', cancelInterview);

// Hodim sifatida rasmiylashtirish
router.post('/:id/hire', hireAsEmployee);

module.exports = router;
