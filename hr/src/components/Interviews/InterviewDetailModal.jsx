import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../../services/api'
import { useSnackbar } from '../../contexts/SnackbarContext'

function InterviewDetailModal({ interview, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [showEvaluationForm, setShowEvaluationForm] = useState(false)
  const [showDecisionForm, setShowDecisionForm] = useState(false)
  const [showAddStageForm, setShowAddStageForm] = useState(false)
  const { showSuccess, showError } = useSnackbar()

  const [evaluation, setEvaluation] = useState({
    result: 'passed',
    technicalSkills: { score: 5, comment: '' },
    communicationSkills: { score: 5, comment: '' },
    overallImpression: { score: 5, comment: '' },
    evaluatedBy: '',
  })

  const [decision, setDecision] = useState({
    result: 'hired',
    reason: '',
    decidedBy: '',
  })

  const [newStage, setNewStage] = useState({
    stageName: '',
    interviewDate: '',
    interviewTime: '',
    location: '',
    interviewer: '',
    notes: '',
  })

  if (!interview) return null

  const getCurrentStage = () => {
    if (!interview.stages || interview.stages.length === 0) return null
    return interview.stages.find(s => s.stageOrder === interview.currentStage) || interview.stages[interview.stages.length - 1]
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_process': return 'bg-purple-100 text-purple-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_process': return 'Jarayonda'
      case 'completed': return 'Yakunlangan'
      case 'cancelled': return 'Bekor qilingan'
      default: return status
    }
  }

  const getDecisionColor = (result) => {
    switch (result) {
      case 'hired': return 'bg-emerald-100 text-emerald-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDecisionLabel = (result) => {
    switch (result) {
      case 'hired': return 'Ishga olindi'
      case 'rejected': return 'Rad etildi'
      case 'pending': return 'Kutilmoqda'
      default: return result
    }
  }

  const getCandidateName = () => {
    if (!interview.applicationSubmissionId?.answers) return 'Noma\'lum nomzod'
    const nameAnswer = interview.applicationSubmissionId.answers.find(
      (ans) => ans.question && (ans.question.toLowerCase().includes('ism') || ans.question.toLowerCase().includes('familiya'))
    )
    if (nameAnswer) return nameAnswer.answer || 'Noma\'lum nomzod'
    if (interview.applicationSubmissionId.answers.length > 0) {
      return interview.applicationSubmissionId.answers[0].answer || 'Noma\'lum nomzod'
    }
    return 'Noma\'lum nomzod'
  }

  const handleStartInterview = async () => {
    setLoading(true)
    const result = await apiService.startInterview(interview.id || interview._id)
    if (result.success) {
      showSuccess('Intervyu boshlandi')
      onUpdate?.()
      onClose()
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const handleCompleteInterview = async () => {
    setLoading(true)
    const result = await apiService.completeInterview(interview.id || interview._id, evaluation)
    if (result.success) {
      showSuccess(evaluation.result === 'passed' ? 'Bosqich muvaffaqiyatli yakunlandi' : 'Bosqich yakunlandi - nomzod o\'tmadi')
      onUpdate?.()
      onClose()
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const handleMakeDecision = async () => {
    if (!decision.result) {
      showError('Qaror tanlanishi shart')
      return
    }
    setLoading(true)
    const result = await apiService.makeInterviewDecision(interview.id || interview._id, decision)
    if (result.success) {
      showSuccess(decision.result === 'hired' ? 'Nomzod ishga olindi' : 'Nomzod rad etildi')
      onUpdate?.()
      onClose()
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const handleUpdateResponse = async () => {
    setLoading(true)
    const result = await apiService.updateInterviewResponse(interview.id || interview._id, 'responded')
    if (result.success) {
      showSuccess('Nomzodga javob berildi')
      onUpdate?.()
      onClose()
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const handleCancelInterview = async () => {
    setLoading(true)
    const result = await apiService.cancelInterview(interview.id || interview._id)
    if (result.success) {
      showSuccess('Intervyu bekor qilindi')
      onUpdate?.()
      onClose()
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const handleAddStage = async () => {
    if (!newStage.stageName || !newStage.interviewDate) {
      showError('Bosqich nomi va sana kiritilishi shart')
      return
    }
    setLoading(true)
    const result = await apiService.addInterviewStage(interview.id || interview._id, newStage)
    if (result.success) {
      showSuccess('Yangi bosqich qo\'shildi')
      setShowAddStageForm(false)
      setNewStage({ stageName: '', interviewDate: '', interviewTime: '', location: '', interviewer: '', notes: '' })
      onUpdate?.()
      onClose()
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const isBase64Image = (str) => {
    if (typeof str !== 'string') return false
    return str.startsWith('data:image/') || (str.length > 100 && /^[A-Za-z0-9+/=]+$/.test(str.replace(/\s/g, '')))
  }

  const renderAnswer = (answer) => {
    if (Array.isArray(answer.answer)) {
      return (
        <div className="flex flex-wrap gap-2">
          {answer.answer.map((item, index) => {
            if (isBase64Image(item)) {
              return (
                <img
                  key={index}
                  src={item.startsWith('data:') ? item : `data:image/jpeg;base64,${item}`}
                  alt={`Rasm ${index + 1}`}
                  className="max-w-24 max-h-24 rounded-lg border border-gray-200 object-contain cursor-pointer hover:opacity-80"
                  onClick={(e) => {
                    const modal = document.createElement('div')
                    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] p-4'
                    modal.onclick = () => modal.remove()
                    const img = document.createElement('img')
                    img.src = e.target.src
                    img.className = 'max-w-full max-h-[90vh] object-contain rounded-lg'
                    modal.appendChild(img)
                    document.body.appendChild(modal)
                  }}
                />
              )
            }
            return <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">{item}</span>
          })}
        </div>
      )
    }
    if (typeof answer.answer === 'string' && isBase64Image(answer.answer)) {
      return (
        <img
          src={answer.answer.startsWith('data:') ? answer.answer : `data:image/jpeg;base64,${answer.answer}`}
          alt="Rasm"
          className="max-w-32 max-h-32 rounded-lg border border-gray-200 object-contain cursor-pointer hover:opacity-80"
          onClick={(e) => {
            const modal = document.createElement('div')
            modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] p-4'
            modal.onclick = () => modal.remove()
            const img = document.createElement('img')
            img.src = e.target.src
            img.className = 'max-w-full max-h-[90vh] object-contain rounded-lg'
            modal.appendChild(img)
            document.body.appendChild(modal)
          }}
        />
      )
    }
    return <span className="text-gray-900 whitespace-pre-wrap break-words">{answer.answer || '—'}</span>
  }

  const currentStage = getCurrentStage()
  const detailBlocks = [
    { label: 'Vakansiya', value: interview.vacancyId?.nom || '—' },
    { label: 'Nomzod', value: getCandidateName() },
    { label: 'Joriy bosqich', value: currentStage?.stageName || '—' },
    { label: 'Bosqich sanasi', value: formatDate(currentStage?.interviewDate) },
    { label: 'Vaqti', value: currentStage?.interviewTime || '—' },
    { label: 'Joylashuv', value: currentStage?.location || '—' },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto"
        >
          <div className="px-8 py-6 border-b border-gray-100 flex flex-wrap items-center gap-4 justify-between sticky top-0 bg-white z-10">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">Intervyu</p>
              <h2 className="text-2xl font-bold text-gray-900">{getCandidateName()}</h2>
              <p className="text-sm text-gray-500 mt-1">{interview.vacancyId?.nom || 'Noma\'lum vakansiya'}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(interview.status)}`}>
                {getStatusLabel(interview.status)}
              </span>
              {interview.finalDecision?.result && interview.finalDecision.result !== 'pending' && (
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getDecisionColor(interview.finalDecision.result)}`}>
                  {getDecisionLabel(interview.finalDecision.result)}
                </span>
              )}
              <button onClick={onClose} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Asosiy ma'lumotlar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {detailBlocks.map((block) => (
                <div key={block.label} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{block.label}</p>
                  <p className="text-base font-semibold text-gray-900">{block.value}</p>
                </div>
              ))}
            </div>

            {/* Amallar */}
            <div className="flex flex-wrap gap-3">
              {interview.status === 'in_process' && getCurrentStage()?.status === 'scheduled' && (
                <>
                  <button
                    onClick={handleStartInterview}
                    disabled={loading}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50"
                  >
                    Bosqichni boshlash
                  </button>
                  <button
                    onClick={handleCancelInterview}
                    disabled={loading}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    Bekor qilish
                  </button>
                </>
              )}
              {interview.status === 'in_process' && getCurrentStage()?.status === 'in_progress' && (
                <button
                  onClick={() => setShowEvaluationForm(true)}
                  disabled={loading}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Bosqichni yakunlash
                </button>
              )}
              {interview.status === 'in_process' && getCurrentStage()?.status === 'completed' && getCurrentStage()?.result === 'passed' && (
                <>
                  <button
                    onClick={() => setShowAddStageForm(true)}
                    disabled={loading}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Keyingi bosqich qo'shish
                  </button>
                  <button
                    onClick={() => setShowDecisionForm(true)}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Yakuniy qaror qabul qilish
                  </button>
                </>
              )}
              {interview.finalDecision?.result && interview.finalDecision.result !== 'pending' && interview.finalDecision.responseStatus === 'waiting' && (
                <button
                  onClick={handleUpdateResponse}
                  disabled={loading}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 disabled:opacity-50"
                >
                  Javob berildi deb belgilash
                </button>
              )}
            </div>

            {/* Yangi bosqich qo'shish formasi */}
            {showAddStageForm && (
              <div className="p-6 border border-indigo-200 rounded-2xl bg-indigo-50/50 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Keyingi bosqich qo'shish</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bosqich nomi *</label>
                    <input
                      type="text"
                      value={newStage.stageName}
                      onChange={(e) => setNewStage({ ...newStage, stageName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="Texnik intervyu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sana *</label>
                    <input
                      type="date"
                      value={newStage.interviewDate}
                      onChange={(e) => setNewStage({ ...newStage, interviewDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vaqti</label>
                    <input
                      type="time"
                      value={newStage.interviewTime}
                      onChange={(e) => setNewStage({ ...newStage, interviewTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joylashuv</label>
                    <input
                      type="text"
                      value={newStage.location}
                      onChange={(e) => setNewStage({ ...newStage, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="Online - Zoom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suhbat oluvchi</label>
                    <input
                      type="text"
                      value={newStage.interviewer}
                      onChange={(e) => setNewStage({ ...newStage, interviewer: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ism familiya"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
                    <input
                      type="text"
                      value={newStage.notes}
                      onChange={(e) => setNewStage({ ...newStage, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="Qo'shimcha ma'lumot"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddStage}
                    disabled={loading}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Saqlanmoqda...' : 'Bosqich qo\'shish'}
                  </button>
                  <button
                    onClick={() => setShowAddStageForm(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}

            {/* Baholash formasi */}
            {showEvaluationForm && (
              <div className="p-6 border border-blue-200 rounded-2xl bg-blue-50/50 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Bosqichni yakunlash</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Natija *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stageResult"
                        value="passed"
                        checked={evaluation.result === 'passed'}
                        onChange={() => setEvaluation({ ...evaluation, result: 'passed' })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-green-700 font-medium">O'tdi</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stageResult"
                        value="failed"
                        checked={evaluation.result === 'failed'}
                        onChange={() => setEvaluation({ ...evaluation, result: 'failed' })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-red-700 font-medium">O'tmadi</span>
                    </label>
                  </div>
                </div>
                {['technicalSkills', 'communicationSkills', 'overallImpression'].map((skill) => (
                  <div key={skill} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {skill === 'technicalSkills' ? 'Texnik ko\'nikmalar' :
                         skill === 'communicationSkills' ? 'Muloqot qobiliyati' : 'Umumiy taassurot'} (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={evaluation[skill].score}
                        onChange={(e) => setEvaluation({
                          ...evaluation,
                          [skill]: { ...evaluation[skill], score: parseInt(e.target.value) || 1 }
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
                      <input
                        type="text"
                        value={evaluation[skill].comment}
                        onChange={(e) => setEvaluation({
                          ...evaluation,
                          [skill]: { ...evaluation[skill], comment: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Baholagan shaxs</label>
                  <input
                    type="text"
                    value={evaluation.evaluatedBy}
                    onChange={(e) => setEvaluation({ ...evaluation, evaluatedBy: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Ism familiya"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCompleteInterview}
                    disabled={loading}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Saqlanmoqda...' : 'Yakunlash'}
                  </button>
                  <button
                    onClick={() => setShowEvaluationForm(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}

            {/* Qaror formasi */}
            {showDecisionForm && (
              <div className="p-6 border border-green-200 rounded-2xl bg-green-50/50 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Qaror qabul qilish</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Natija *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="result"
                        value="hired"
                        checked={decision.result === 'hired'}
                        onChange={() => setDecision({ ...decision, result: 'hired' })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-green-700 font-medium">Ishga olish</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="result"
                        value="rejected"
                        checked={decision.result === 'rejected'}
                        onChange={() => setDecision({ ...decision, result: 'rejected' })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-red-700 font-medium">Rad etish</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sabab</label>
                  <textarea
                    value={decision.reason}
                    onChange={(e) => setDecision({ ...decision, reason: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Qaror sababi..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qaror qabul qilgan</label>
                  <input
                    type="text"
                    value={decision.decidedBy}
                    onChange={(e) => setDecision({ ...decision, decidedBy: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Ism familiya"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleMakeDecision}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saqlanmoqda...' : 'Qarorni saqlash'}
                  </button>
                  <button
                    onClick={() => setShowDecisionForm(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}

            {/* Bosqichlar */}
            {interview.stages && interview.stages.length > 0 && (
              <div className="p-6 border border-gray-100 rounded-2xl bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bosqichlar</h3>
                <div className="space-y-4">
                  {interview.stages.map((stage, index) => (
                    <div key={stage._id || index} className={`p-4 rounded-xl border ${stage.result === 'passed' ? 'border-green-200 bg-green-50/50' : stage.result === 'failed' ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{stage.stageOrder}. {stage.stageName}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${stage.result === 'passed' ? 'bg-green-100 text-green-700' : stage.result === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {stage.result === 'passed' ? 'O\'tdi' : stage.result === 'failed' ? 'O\'tmadi' : 'Kutilmoqda'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>{formatDate(stage.interviewDate)}</span>
                        {stage.interviewTime && <span> • {stage.interviewTime}</span>}
                        {stage.location && <span> • {stage.location}</span>}
                      </div>
                      {stage.evaluation && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {[
                            { key: 'technicalSkills', label: 'Texnik' },
                            { key: 'communicationSkills', label: 'Muloqot' },
                            { key: 'overallImpression', label: 'Umumiy' },
                          ].map(({ key, label }) => (
                            stage.evaluation[key] && (
                              <div key={key} className="text-center p-2 bg-white rounded-lg">
                                <p className="text-lg font-bold text-blue-600">{stage.evaluation[key]?.score || '—'}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qaror */}
            {interview.finalDecision && interview.finalDecision.result !== 'pending' && (
              <div className={`p-6 border rounded-2xl ${interview.finalDecision.result === 'hired' ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Qaror</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getDecisionColor(interview.finalDecision.result)}`}>
                    {getDecisionLabel(interview.finalDecision.result)}
                  </span>
                  {interview.finalDecision.responseStatus === 'responded' && (
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                      Javob berildi
                    </span>
                  )}
                </div>
                {interview.finalDecision.reason && (
                  <p className="text-gray-700 mb-3">{interview.finalDecision.reason}</p>
                )}
                <p className="text-sm text-gray-500">
                  {interview.finalDecision.decidedBy && `Qaror: ${interview.finalDecision.decidedBy}`}
                  {interview.finalDecision.decidedAt && ` • ${formatDate(interview.finalDecision.decidedAt)}`}
                </p>
              </div>
            )}

            {/* Nomzod javoblari */}
            {interview.applicationSubmissionId?.answers && interview.applicationSubmissionId.answers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nomzod javoblari</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-12">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Savol</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Javob</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {interview.applicationSubmissionId.answers.map((answer, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{answer.question || 'Savol'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{renderAnswer(answer)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default InterviewDetailModal
