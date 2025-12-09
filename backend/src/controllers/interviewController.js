const Interview = require('../models/Interview');
const ApplicationSubmission = require('../models/ApplicationSubmission');
const Employee = require('../models/Employee');

// Intervyu jarayonini boshlash (birinchi bosqich)
const createInterview = async (req, res) => {
  try {
    const {
      applicationSubmissionId,
      stageName,
      interviewDate,
      interviewTime,
      location,
      interviewer,
      notes,
    } = req.body;
    const companyId = req.company._id;

    const application = await ApplicationSubmission.findOne({
      _id: applicationSubmissionId,
      companyId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Ariza topilmadi yoki sizning kompaniyangizga tegishli emas',
      });
    }

    if (application.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Faqat tasdiqlangan (accepted) nomzodlar uchun intervyu belgilash mumkin',
      });
    }

    const existingInterview = await Interview.findOne({ applicationSubmissionId });
    if (existingInterview) {
      return res.status(400).json({
        success: false,
        message: 'Bu nomzod uchun intervyu jarayoni allaqachon mavjud',
      });
    }

    // Sana tekshiruvi
    const interviewDateTime = new Date(interviewDate);
    if (interviewTime) {
      const [hours, minutes] = interviewTime.split(':');
      interviewDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    if (interviewDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Intervyu sanasi o\'tgan bo\'lishi mumkin emas',
      });
    }

    const interview = new Interview({
      companyId,
      vacancyId: application.vacancyId,
      applicationSubmissionId,
      currentStage: 1,
      stages: [{
        stageName: stageName || '1-bosqich',
        stageOrder: 1,
        interviewDate: new Date(interviewDate),
        interviewTime,
        location,
        interviewer,
        notes,
        status: 'scheduled',
        result: 'pending',
      }],
      status: 'in_process',
      finalDecision: {
        result: 'pending',
        responseStatus: 'waiting',
      },
    });

    await interview.save();
    await interview.populate('vacancyId', 'nom');
    await interview.populate('applicationSubmissionId', 'answers status');

    res.status(201).json({
      success: true,
      message: 'Intervyu jarayoni boshlandi',
      interview,
    });
  } catch (error) {
    console.error('Create interview error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu nomzod uchun intervyu allaqachon mavjud',
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Keyingi bosqich qo'shish
const addStage = async (req, res) => {
  try {
    const { stageName, interviewDate, interviewTime, location, interviewer, notes } = req.body;
    const companyId = req.company._id;

    const interview = await Interview.findOne({ _id: req.params.id, companyId });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    if (interview.status !== 'in_process') {
      return res.status(400).json({
        success: false,
        message: 'Faqat jarayondagi intervyularga bosqich qo\'shish mumkin',
      });
    }

    // Joriy bosqich yakunlanganmi?
    const currentStageData = interview.stages.find(s => s.stageOrder === interview.currentStage);
    if (currentStageData && currentStageData.result === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Avval joriy bosqichni yakunlang',
      });
    }

    // Sana tekshiruvi
    const interviewDateTime = new Date(interviewDate);
    if (interviewTime) {
      const [hours, minutes] = interviewTime.split(':');
      interviewDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    if (interviewDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Intervyu sanasi o\'tgan bo\'lishi mumkin emas',
      });
    }

    const newStageOrder = interview.stages.length + 1;
    interview.stages.push({
      stageName: stageName || `${newStageOrder}-bosqich`,
      stageOrder: newStageOrder,
      interviewDate: new Date(interviewDate),
      interviewTime,
      location,
      interviewer,
      notes,
      status: 'scheduled',
      result: 'pending',
    });
    interview.currentStage = newStageOrder;

    await interview.save();
    await interview.populate('vacancyId', 'nom');
    await interview.populate('applicationSubmissionId', 'answers status');

    res.json({
      success: true,
      message: `${newStageOrder}-bosqich qo'shildi`,
      interview,
    });
  } catch (error) {
    console.error('Add stage error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bosqichni boshlash
const startStage = async (req, res) => {
  try {
    const companyId = req.company._id;
    const interview = await Interview.findOne({ _id: req.params.id, companyId });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    const currentStageData = interview.stages.find(s => s.stageOrder === interview.currentStage);
    if (!currentStageData) {
      return res.status(400).json({ success: false, message: 'Joriy bosqich topilmadi' });
    }

    if (currentStageData.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Faqat belgilangan bosqichlarni boshlash mumkin',
      });
    }

    currentStageData.status = 'in_progress';
    await interview.save();
    await interview.populate('vacancyId', 'nom');
    await interview.populate('applicationSubmissionId', 'answers status');

    res.json({
      success: true,
      message: `${currentStageData.stageName} boshlandi`,
      interview,
    });
  } catch (error) {
    console.error('Start stage error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bosqichni yakunlash (baholash va natija bilan)
const completeStage = async (req, res) => {
  try {
    const { result, evaluation, evaluatedBy } = req.body;
    const companyId = req.company._id;

    if (!result || !['passed', 'failed'].includes(result)) {
      return res.status(400).json({
        success: false,
        message: 'Natija "passed" yoki "failed" bo\'lishi kerak',
      });
    }

    const interview = await Interview.findOne({ _id: req.params.id, companyId });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    const currentStageData = interview.stages.find(s => s.stageOrder === interview.currentStage);
    if (!currentStageData) {
      return res.status(400).json({ success: false, message: 'Joriy bosqich topilmadi' });
    }

    if (!['scheduled', 'in_progress'].includes(currentStageData.status)) {
      return res.status(400).json({
        success: false,
        message: 'Bu bosqich allaqachon yakunlangan',
      });
    }

    currentStageData.status = 'completed';
    currentStageData.result = result;
    currentStageData.completedAt = new Date();

    if (evaluation) {
      currentStageData.evaluation = {
        ...evaluation,
        evaluatedAt: new Date(),
        evaluatedBy: evaluatedBy || currentStageData.interviewer,
      };
    }

    // Agar failed bo'lsa, butun jarayonni yakunlash
    if (result === 'failed') {
      interview.status = 'completed';
      interview.finalDecision = {
        result: 'rejected',
        reason: `${currentStageData.stageName}da o'tmadi`,
        responseStatus: 'waiting',
        decidedAt: new Date(),
      };
    }

    await interview.save();
    await interview.populate('vacancyId', 'nom');
    await interview.populate('applicationSubmissionId', 'answers status');

    res.json({
      success: true,
      message: result === 'passed' 
        ? `${currentStageData.stageName} muvaffaqiyatli o'tildi` 
        : `${currentStageData.stageName}da o'tmadi`,
      interview,
    });
  } catch (error) {
    console.error('Complete stage error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Yakuniy qaror (ishga olish yoki rad etish)
const makeFinalDecision = async (req, res) => {
  try {
    const { result, reason, decidedBy } = req.body;
    const companyId = req.company._id;

    if (!result || !['hired', 'rejected'].includes(result)) {
      return res.status(400).json({
        success: false,
        message: 'Natija "hired" yoki "rejected" bo\'lishi kerak',
      });
    }

    const interview = await Interview.findOne({ _id: req.params.id, companyId });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    // Joriy bosqich yakunlanganmi?
    const currentStageData = interview.stages.find(s => s.stageOrder === interview.currentStage);
    if (currentStageData && currentStageData.result === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Avval joriy bosqichni yakunlang',
      });
    }

    interview.status = 'completed';
    interview.finalDecision = {
      result,
      reason,
      decidedBy,
      decidedAt: new Date(),
      responseStatus: 'waiting',
    };

    await interview.save();
    await interview.populate('vacancyId', 'nom');
    await interview.populate('applicationSubmissionId', 'answers status');

    res.json({
      success: true,
      message: result === 'hired' ? 'Nomzod ishga olindi' : 'Nomzod rad etildi',
      interview,
    });
  } catch (error) {
    console.error('Make final decision error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Javob berildi
const updateResponseStatus = async (req, res) => {
  try {
    const { responseStatus } = req.body;
    const companyId = req.company._id;

    if (!responseStatus || !['waiting', 'responded'].includes(responseStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Javob holati "waiting" yoki "responded" bo\'lishi kerak',
      });
    }

    const interview = await Interview.findOne({ _id: req.params.id, companyId });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    if (!interview.finalDecision || interview.finalDecision.result === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Avval yakuniy qaror qabul qiling',
      });
    }

    interview.finalDecision.responseStatus = responseStatus;
    if (responseStatus === 'responded') {
      interview.finalDecision.respondedAt = new Date();
    }

    await interview.save();
    await interview.populate('vacancyId', 'nom');
    await interview.populate('applicationSubmissionId', 'answers status');

    res.json({
      success: true,
      message: responseStatus === 'responded' ? 'Nomzodga javob berildi' : 'Javob kutilmoqda',
      interview,
    });
  } catch (error) {
    console.error('Update response status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bekor qilish
const cancelInterview = async (req, res) => {
  try {
    const { reason } = req.body;
    const companyId = req.company._id;

    const interview = await Interview.findOne({ _id: req.params.id, companyId });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Yakunlangan intervyuni bekor qilib bo\'lmaydi',
      });
    }

    interview.status = 'cancelled';
    
    // Joriy bosqichni ham bekor qilish
    const currentStageData = interview.stages.find(s => s.stageOrder === interview.currentStage);
    if (currentStageData && currentStageData.status !== 'completed') {
      currentStageData.status = 'cancelled';
      if (reason) {
        currentStageData.notes = (currentStageData.notes ? currentStageData.notes + '\n' : '') + `Bekor qilish sababi: ${reason}`;
      }
    }

    await interview.save();
    await interview.populate('vacancyId', 'nom');
    await interview.populate('applicationSubmissionId', 'answers status');

    res.json({
      success: true,
      message: 'Intervyu bekor qilindi',
      interview,
    });
  } catch (error) {
    console.error('Cancel interview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Barcha intervyularni olish
const getAllInterviews = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { 
      vacancyId, 
      applicationSubmissionId, 
      status,
      finalResult,
      responseStatus,
    } = req.query;

    const query = { companyId };
    
    if (vacancyId) query.vacancyId = vacancyId;
    if (applicationSubmissionId) query.applicationSubmissionId = applicationSubmissionId;
    if (status) query.status = status;
    if (finalResult) query['finalDecision.result'] = finalResult;
    if (responseStatus) query['finalDecision.responseStatus'] = responseStatus;

    const interviews = await Interview.find(query)
      .populate('vacancyId', 'nom')
      .populate('applicationSubmissionId', 'answers status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error('Get all interviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bitta intervyuni olish
const getInterview = async (req, res) => {
  try {
    const companyId = req.company._id;
    const interview = await Interview.findOne({ _id: req.params.id, companyId })
      .populate('vacancyId', 'nom')
      .populate('applicationSubmissionId');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    res.json({ success: true, interview });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Ariza bo'yicha intervyuni olish
const getInterviewByApplicationId = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { applicationSubmissionId } = req.params;

    const interview = await Interview.findOne({ applicationSubmissionId, companyId })
      .populate('vacancyId', 'nom')
      .populate('applicationSubmissionId', 'answers status');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    res.json({ success: true, interview });
  } catch (error) {
    console.error('Get interview by application ID error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bosqichni yangilash
const updateStage = async (req, res) => {
  try {
    const { stageId } = req.params;
    const { stageName, interviewDate, interviewTime, location, interviewer, notes } = req.body;
    const companyId = req.company._id;

    const interview = await Interview.findOne({ _id: req.params.id, companyId });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    const stage = interview.stages.id(stageId);
    if (!stage) {
      return res.status(404).json({ success: false, message: 'Bosqich topilmadi' });
    }

    if (stage.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Yakunlangan bosqichni o\'zgartirish mumkin emas',
      });
    }

    if (stageName) stage.stageName = stageName;
    if (interviewDate) stage.interviewDate = new Date(interviewDate);
    if (interviewTime) stage.interviewTime = interviewTime;
    if (location !== undefined) stage.location = location;
    if (interviewer !== undefined) stage.interviewer = interviewer;
    if (notes !== undefined) stage.notes = notes;

    await interview.save();
    await interview.populate('vacancyId', 'nom');
    await interview.populate('applicationSubmissionId', 'answers status');

    res.json({
      success: true,
      message: 'Bosqich yangilandi',
      interview,
    });
  } catch (error) {
    console.error('Update stage error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Hodim sifatida rasmiylashtirish
const hireAsEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      birthDate,
      gender,
      phone,
      passport,
      address,
      departmentId,
      positionId,
      hireDate,
    } = req.body;
    const companyId = req.company._id;

    const interview = await Interview.findOne({ _id: req.params.id, companyId });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    // Faqat hired bo'lgan nomzodlar uchun
    if (!interview.finalDecision || interview.finalDecision.result !== 'hired') {
      return res.status(400).json({
        success: false,
        message: 'Faqat ishga olingan nomzodlarni rasmiylashtirish mumkin',
      });
    }

    // Allaqachon rasmiylashtirilanmi?
    if (interview.employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Bu nomzod allaqachon hodim sifatida rasmiylashtirilgan',
      });
    }

    // Hodim yaratish
    const employee = new Employee({
      companyId,
      firstName,
      lastName,
      middleName,
      birthDate: new Date(birthDate),
      gender,
      phone,
      passport,
      address,
      departmentId,
      positionId,
      hireDate: hireDate ? new Date(hireDate) : new Date(),
    });

    await employee.save();

    // Intervyuga hodim ID ni bog'lash
    interview.employeeId = employee._id;
    await interview.save();

    await employee.populate('departmentId', 'name');
    await employee.populate('positionId', 'name');

    res.status(201).json({
      success: true,
      message: 'Nomzod hodim sifatida rasmiylashtirildi',
      employee,
    });
  } catch (error) {
    console.error('Hire as employee error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu passport raqami bilan hodim allaqachon mavjud',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Intervyuni o'chirish
const deleteInterview = async (req, res) => {
  try {
    const companyId = req.company._id;
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, companyId });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Intervyu topilmadi' });
    }

    res.json({ success: true, message: 'Intervyu o\'chirildi' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
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
};
