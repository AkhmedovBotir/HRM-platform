const ApplicationSubmission = require('../models/ApplicationSubmission');
const ApplicationForm = require('../models/ApplicationForm');
const Vacancy = require('../models/Vacancy');

// Submit Application (Public - no auth)
const submitApplication = async (req, res) => {
  try {
    const { vacancyId, answers } = req.body;

    // Validate vacancy exists
    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vakansiya topilmadi',
      });
    }

    // Check if vacancy is active
    if (vacancy.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Bu vakansiya yopilgan',
      });
    }

    // Get application form for this vacancy
    const applicationForm = await ApplicationForm.findOne({
      vacancyId,
      status: 'active',
    });

    if (!applicationForm) {
      return res.status(404).json({
        success: false,
        message: 'So\'rovnoma yo\'q',
      });
    }

    // Validate answers
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Kamida bitta javob bo\'lishi kerak',
      });
    }

    // Validate all required questions are answered
    const formQuestions = applicationForm.questions;
    const requiredQuestions = formQuestions.filter(q => q.required);
    
    for (const requiredQ of requiredQuestions) {
      const answer = answers.find(a => a.questionId.toString() === requiredQ._id.toString());
      if (!answer || (answer.answer === undefined || answer.answer === null || answer.answer === '')) {
        return res.status(400).json({
          success: false,
          message: `"${requiredQ.question}" savoli majburiy va javob berish kerak`,
        });
      }
    }

    // Validate answers format
    const answersWithQuestions = answers.map(ans => {
      const question = formQuestions.find(q => q._id.toString() === ans.questionId.toString());
      if (!question) {
        throw new Error(`Savol topilmadi: ${ans.questionId}`);
      }

      // Validate answer type
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

      // Validate select, radio, checkbox options
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

    // Create application submission
    const submission = new ApplicationSubmission({
      companyId: vacancy.companyId,
      vacancyId,
      applicationFormId: applicationForm._id,
      answers: answersWithQuestions,
      status: 'pending',
    });

    await submission.save();

    // Increment application count in vacancy
    await Vacancy.findByIdAndUpdate(vacancyId, {
      $inc: { applicationCount: 1 },
    });

    // Populate references
    await submission.populate('vacancyId', 'nom');
    await submission.populate('applicationFormId', 'nom');

    res.status(201).json({
      success: true,
      message: 'Ariza muvaffaqiyatli yuborildi',
      submission: {
        _id: submission._id,
        vacancyId: submission.vacancyId,
        status: submission.status,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error('Submit application error:', error);
    if (error.message) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Applications (Company Authenticated)
const getAllApplications = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { vacancyId, status, source } = req.query;

    const query = { companyId };
    if (vacancyId) {
      query.vacancyId = vacancyId;
    }
    if (status) {
      query.status = status;
    }
    if (source) {
      query.source = source;
    }

    const applications = await ApplicationSubmission.find(query)
      .populate('vacancyId', 'nom')
      .populate('applicationFormId', 'nom')
      .populate('referralEmployeeId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get Single Application
const getApplication = async (req, res) => {
  try {
    const companyId = req.company._id;
    const application = await ApplicationSubmission.findOne({
      _id: req.params.id,
      companyId,
    })
      .populate('vacancyId', 'nom')
      .populate('applicationFormId', 'nom')
      .populate('referralEmployeeId', 'firstName lastName phone');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Ariza topilmadi',
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Get application error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri ariza ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Application Status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const companyId = req.company._id;

    if (!status || !['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "pending", "reviewed", "accepted" yoki "rejected" bo\'lishi kerak',
      });
    }

    const application = await ApplicationSubmission.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Ariza topilmadi',
      });
    }

    application.status = status;
    if (notes !== undefined) {
      application.notes = notes;
    }

    await application.save();

    // Populate references
    await application.populate('vacancyId', 'nom');
    await application.populate('applicationFormId', 'nom');

    res.json({
      success: true,
      message: 'Ariza status muvaffaqiyatli yangilandi',
      application,
    });
  } catch (error) {
    console.error('Update application status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri ariza ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete Application
const deleteApplication = async (req, res) => {
  try {
    const companyId = req.company._id;
    const application = await ApplicationSubmission.findOne({
      _id: req.params.id,
      companyId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Ariza topilmadi',
      });
    }

    // Decrement application count in vacancy
    await Vacancy.findByIdAndUpdate(application.vacancyId, {
      $inc: { applicationCount: -1 },
    });

    await ApplicationSubmission.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Ariza muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('Delete application error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri ariza ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
};

