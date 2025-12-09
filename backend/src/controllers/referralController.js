const ApplicationSubmission = require('../models/ApplicationSubmission');
const ApplicationForm = require('../models/ApplicationForm');
const Vacancy = require('../models/Vacancy');
const Employee = require('../models/Employee');

// Kompaniya admin orqali referal ariza yuborish
const submitReferral = async (req, res) => {
  try {
    const { vacancyId, answers, referralNote, referralEmployeeId } = req.body;
    const companyId = req.company._id;

    // Referal xodimni tekshirish
    if (!referralEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Referal qiluvchi xodim ID si taqdim etilmagan',
      });
    }

    const referralEmployee = await Employee.findOne({
      _id: referralEmployeeId,
      companyId,
      isTerminated: false,
    });

    if (!referralEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Xodim topilmadi yoki ishdan bo\'shatilgan',
      });
    }

    // Vakansiyani tekshirish
    const vacancy = await Vacancy.findOne({ _id: vacancyId, companyId });
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vakansiya topilmadi yoki sizning kompaniyangizga tegishli emas',
      });
    }

    if (vacancy.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Bu vakansiya yopilgan',
      });
    }

    // Ariza formasini olish
    const applicationForm = await ApplicationForm.findOne({
      vacancyId,
      status: 'active',
    });

    if (!applicationForm) {
      return res.status(404).json({
        success: false,
        message: 'So\'rovnoma topilmadi',
      });
    }

    // Javoblarni tekshirish
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Kamida bitta javob bo\'lishi kerak',
      });
    }

    // Majburiy savollar javob berilganmi
    const formQuestions = applicationForm.questions;
    const requiredQuestions = formQuestions.filter(q => q.required);
    
    for (const requiredQ of requiredQuestions) {
      const answer = answers.find(a => a.questionId.toString() === requiredQ._id.toString());
      if (!answer || (answer.answer === undefined || answer.answer === null || answer.answer === '')) {
        return res.status(400).json({
          success: false,
          message: `"${requiredQ.question}" savoli majburiy`,
        });
      }
    }

    // Javoblarni formatlash
    const answersWithQuestions = answers.map(ans => {
      const question = formQuestions.find(q => q._id.toString() === ans.questionId.toString());
      if (!question) {
        throw new Error(`Savol topilmadi: ${ans.questionId}`);
      }

      // Javob turini tekshirish
      let isValidAnswer = true;
      if (question.type === 'checkbox') {
        isValidAnswer = Array.isArray(ans.answer);
      } else if (question.type === 'number') {
        isValidAnswer = typeof ans.answer === 'number' || !isNaN(Number(ans.answer));
      } else {
        isValidAnswer = typeof ans.answer === 'string' || ans.answer instanceof Date;
      }

      if (!isValidAnswer) {
        throw new Error(`"${question.question}" savoli uchun noto'g'ri javob formati`);
      }

      // Select, radio, checkbox variantlarini tekshirish
      if (['select', 'radio'].includes(question.type)) {
        if (!question.options.includes(ans.answer)) {
          throw new Error(`"${question.question}" savoli uchun tanlangan variant mavjud emas`);
        }
      } else if (question.type === 'checkbox') {
        if (!Array.isArray(ans.answer) || !ans.answer.every(opt => question.options.includes(opt))) {
          throw new Error(`"${question.question}" savoli uchun tanlangan variantlar mavjud emas`);
        }
      }

      return {
        questionId: ans.questionId,
        question: question.question,
        answer: ans.answer,
      };
    });

    // Referal ariza yaratish
    const submission = new ApplicationSubmission({
      companyId,
      vacancyId,
      applicationFormId: applicationForm._id,
      answers: answersWithQuestions,
      status: 'pending',
      source: 'referral',
      referralEmployeeId,
      referralNote: referralNote || '',
    });

    await submission.save();

    // Vakansiya ariza sonini oshirish
    await Vacancy.findByIdAndUpdate(vacancyId, {
      $inc: { applicationCount: 1 },
    });

    // Populate
    await submission.populate('vacancyId', 'nom');
    await submission.populate('applicationFormId', 'nom');
    await submission.populate('referralEmployeeId', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Referal ariza muvaffaqiyatli yuborildi',
      submission,
    });
  } catch (error) {
    console.error('Submit referral error:', error);
    if (error.message) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Kompaniya uchun barcha referal arizalarni olish
const getAllReferrals = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { status, vacancyId, referralEmployeeId } = req.query;

    const query = { 
      companyId,
      source: 'referral',
    };
    
    if (status) query.status = status;
    if (vacancyId) query.vacancyId = vacancyId;
    if (referralEmployeeId) query.referralEmployeeId = referralEmployeeId;

    const referrals = await ApplicationSubmission.find(query)
      .populate('vacancyId', 'nom')
      .populate('applicationFormId', 'nom')
      .populate('referralEmployeeId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    console.error('Get all referrals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Bitta referal arizani olish
const getReferral = async (req, res) => {
  try {
    const companyId = req.company._id;

    const referral = await ApplicationSubmission.findOne({
      _id: req.params.id,
      companyId,
      source: 'referral',
    })
      .populate('vacancyId', 'nom')
      .populate('applicationFormId', 'nom')
      .populate('referralEmployeeId', 'firstName lastName phone');

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referal ariza topilmadi',
      });
    }

    res.json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error('Get referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Referal uchun xodimlar ro'yxati
const getEmployeesForReferral = async (req, res) => {
  try {
    const companyId = req.company._id;

    const employees = await Employee.find({ 
      companyId, 
      isTerminated: false 
    })
      .populate('departmentId', 'nom')
      .populate('positionId', 'nom')
      .select('firstName lastName middleName phone departmentId positionId')
      .sort({ firstName: 1 });

    res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error('Get employees for referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  submitReferral,
  getAllReferrals,
  getReferral,
  getEmployeesForReferral,
};

