import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'

const DECISION_FILTERS = [
  { value: 'all', label: 'Barcha' },
  { value: 'hired', label: 'Ishga olingan' },
  { value: 'rejected', label: 'Rad etilgan' },
  { value: 'pending', label: 'Kutilmoqda' },
]

const RESPONSE_FILTERS = [
  { value: 'all', label: 'Barcha' },
  { value: 'waiting', label: 'Javob kutilmoqda' },
  { value: 'responded', label: 'Javob berilgan' },
]

function Results() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [decisionFilter, setDecisionFilter] = useState('all')
  const [responseFilter, setResponseFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [showHireModal, setShowHireModal] = useState(null)
  const [hireForm, setHireForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: 'male',
    phone: '',
    passport: '',
    address: '',
    departmentId: '',
    positionId: '',
    hireDate: '',
  })
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchInterviews()
    fetchDepartmentsAndPositions()
  }, [decisionFilter, responseFilter])

  const fetchDepartmentsAndPositions = async () => {
    const [deptResult, posResult] = await Promise.all([
      apiService.getDepartments(),
      apiService.getPositions(),
    ])
    if (deptResult.success) setDepartments(deptResult.data.departments || [])
    if (posResult.success) setPositions(posResult.data.positions || [])
  }

  const fetchInterviews = async () => {
    setLoading(true)
    const filters = {}
    
    if (decisionFilter !== 'all') {
      filters.finalResult = decisionFilter
    }
    if (responseFilter !== 'all') {
      filters.responseStatus = responseFilter
    }

    const result = await apiService.getInterviews(filters)
    console.log('result', result)
    if (result.success) {
      const normalized = (result.data.interviews || []).map((interview) => ({
        ...interview,
        id: interview.id || interview._id,
        vacancyName: interview.vacancyId?.nom || 'Noma\'lum vakansiya',
        candidateName: getCandidateName(interview),
      }))
      setInterviews(normalized)
    } else {
      showError(result.error || 'Natijalarni yuklashda xatolik')
    }
    setLoading(false)
  }

  const getCandidateName = (interview) => {
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

  const handleUpdateResponse = async (interview) => {
    const interviewId = interview.id || interview._id
    setActionLoading(interviewId)
    
    const result = await apiService.updateInterviewResponse(interviewId, 'responded')
    
    if (result.success) {
      showSuccess('Nomzodga javob berildi')
      await fetchInterviews()
    } else {
      showError(result.error || 'Javob statusini yangilashda xatolik')
    }
    
    setActionLoading(null)
  }

  const handleHireCandidate = async () => {
    if (!hireForm.firstName || !hireForm.lastName || !hireForm.phone || !hireForm.passport || !hireForm.departmentId || !hireForm.positionId) {
      showError('Barcha majburiy maydonlarni to\'ldiring')
      return
    }
    
    setActionLoading(showHireModal)
    const result = await apiService.hireCandidate(showHireModal, hireForm)
    
    if (result.success) {
      showSuccess('Nomzod hodim sifatida rasmiylashtirildi')
      setShowHireModal(null)
      setHireForm({
        firstName: '', lastName: '', middleName: '', birthDate: '', gender: 'male',
        phone: '', passport: '', address: '', departmentId: '', positionId: '', hireDate: '',
      })
      await fetchInterviews()
    } else {
      showError(result.error || 'Rasmiylashtirishda xatolik')
    }
    
    setActionLoading(null)
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

  const getResponseColor = (status) => {
    switch (status) {
      case 'responded': return 'bg-teal-100 text-teal-700'
      case 'waiting': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getResponseLabel = (status) => {
    switch (status) {
      case 'responded': return 'Javob berildi'
      case 'waiting': return 'Kutilmoqda'
      default: return status
    }
  }

  // Statistikalar
  const stats = {
    total: interviews.length,
    hired: interviews.filter(i => i.finalDecision?.result === 'hired').length,
    rejected: interviews.filter(i => i.finalDecision?.result === 'rejected').length,
    waiting: interviews.filter(i => i.finalDecision?.responseStatus === 'waiting').length,
  }

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">Natijalar</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Intervyu natijalari</h1>
            <p className="text-gray-500 mt-2">O'tgan va o'tmagan nomzodlarni boshqaring</p>
          </div>
        </div>

        {/* Statistikalar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-gray-50 rounded-2xl text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Jami</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl text-center">
            <p className="text-3xl font-bold text-emerald-600">{stats.hired}</p>
            <p className="text-sm text-emerald-600">Ishga olingan</p>
          </div>
          <div className="p-4 bg-red-50 rounded-2xl text-center">
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-sm text-red-600">Rad etilgan</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-2xl text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.waiting}</p>
            <p className="text-sm text-orange-600">Javob kutilmoqda</p>
          </div>
        </div>

        {/* Filterlar */}
        <div className="flex flex-wrap items-center gap-6 mt-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">Qaror bo'yicha</p>
            <div className="flex flex-wrap gap-2">
              {DECISION_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setDecisionFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    decisionFilter === filter.value
                      ? 'bg-blue-600 text-white shadow shadow-blue-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Javob holati</p>
            <div className="flex flex-wrap gap-2">
              {RESPONSE_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setResponseFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    responseFilter === filter.value
                      ? 'bg-teal-600 text-white shadow shadow-teal-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
              <div className="space-y-2 mb-6">
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Natijalar topilmadi</h3>
          <p className="text-gray-500">Hozircha intervyu natijalari mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{interview.candidateName}</h3>
                  <p className="text-sm text-gray-500">{interview.vacancyName}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {interview.finalDecision?.result && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDecisionColor(interview.finalDecision.result)}`}>
                      {getDecisionLabel(interview.finalDecision.result)}
                    </span>
                  )}
                  {interview.finalDecision?.responseStatus && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getResponseColor(interview.finalDecision.responseStatus)}`}>
                      {getResponseLabel(interview.finalDecision.responseStatus)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                {interview.evaluation && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Umumiy ball:</span>
                    <span className="text-blue-600 font-bold">{interview.evaluation.overallImpression?.score || '—'}/10</span>
                  </div>
                )}
                {interview.finalDecision?.reason && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-500 text-xs mb-1">Sabab:</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{interview.finalDecision.reason}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {interview.finalDecision?.result && interview.finalDecision.result !== 'pending' && interview.finalDecision.responseStatus === 'waiting' && (
                  <button
                    onClick={() => handleUpdateResponse(interview)}
                    disabled={actionLoading === interview.id}
                    className="w-full px-4 py-2.5 text-sm font-medium text-teal-600 border border-teal-600 rounded-xl hover:bg-teal-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {actionLoading === interview.id ? 'Saqlanmoqda...' : 'Javob berildi deb belgilash'}
                  </button>
                )}
                {interview.finalDecision?.result === 'hired' && interview.finalDecision.responseStatus === 'responded' && !interview.isHired && (
                  <button
                    onClick={() => setShowHireModal(interview.id)}
                    className="w-full px-4 py-2.5 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    Hodim sifatida rasmiylashtirish
                  </button>
                )}
                {interview.isHired && (
                  <span className="block text-center text-sm text-emerald-600 font-medium py-2">
                    ✓ Rasmiylashtirilgan
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Rasmiylashtirish modali */}
      {showHireModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowHireModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Hodim sifatida rasmiylashtirish</h2>
              <button onClick={() => setShowHireModal(null)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ism *</label>
                  <input
                    type="text"
                    value={hireForm.firstName}
                    onChange={(e) => setHireForm({ ...hireForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Familiya *</label>
                  <input
                    type="text"
                    value={hireForm.lastName}
                    onChange={(e) => setHireForm({ ...hireForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Otasining ismi</label>
                  <input
                    type="text"
                    value={hireForm.middleName}
                    onChange={(e) => setHireForm({ ...hireForm, middleName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tug'ilgan sana</label>
                  <input
                    type="date"
                    value={hireForm.birthDate}
                    onChange={(e) => setHireForm({ ...hireForm, birthDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jinsi</label>
                  <select
                    value={hireForm.gender}
                    onChange={(e) => setHireForm({ ...hireForm, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="male">Erkak</option>
                    <option value="female">Ayol</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                  <input
                    type="text"
                    value={hireForm.phone}
                    onChange={(e) => setHireForm({ ...hireForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    placeholder="+998XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passport *</label>
                  <input
                    type="text"
                    value={hireForm.passport}
                    onChange={(e) => setHireForm({ ...hireForm, passport: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    placeholder="AB1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                  <input
                    type="text"
                    value={hireForm.address}
                    onChange={(e) => setHireForm({ ...hireForm, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bo'lim *</label>
                  <select
                    value={hireForm.departmentId}
                    onChange={(e) => setHireForm({ ...hireForm, departmentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Tanlang</option>
                    {departments.map((dept) => (
                      <option key={dept._id || dept.id} value={dept._id || dept.id}>{dept.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lavozim *</label>
                  <select
                    value={hireForm.positionId}
                    onChange={(e) => setHireForm({ ...hireForm, positionId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Tanlang</option>
                    {positions.map((pos) => (
                      <option key={pos._id || pos.id} value={pos._id || pos.id}>{pos.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ishga kirish sanasi</label>
                  <input
                    type="date"
                    value={hireForm.hireDate}
                    onChange={(e) => setHireForm({ ...hireForm, hireDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleHireCandidate}
                  disabled={actionLoading === showHireModal}
                  className="flex-1 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  {actionLoading === showHireModal ? 'Saqlanmoqda...' : 'Rasmiylashtirish'}
                </button>
                <button
                  onClick={() => setShowHireModal(null)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Results

