const express = require('express');
const router = express.Router();
const {
  submitReferral,
  getAllReferrals,
  getReferral,
  getEmployeesForReferral,
} = require('../controllers/referralController');
const authenticateCompany = require('../middlewares/companyAuth');

// Barcha routelar kompaniya auth bilan
router.use(authenticateCompany);

// Referal ariza yuborish (admin xodim nomidan)
router.post('/', submitReferral);

// Referal uchun xodimlar ro'yxati
router.get('/employees', getEmployeesForReferral);

// Barcha referallar
router.get('/', getAllReferrals);

// Bitta referal
router.get('/:id', getReferral);

module.exports = router;

