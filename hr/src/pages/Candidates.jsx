import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import InterviewFormModal from '../components/Candidates/InterviewFormModal'
import ApplicationDetailModal from '../components/Candidates/ApplicationDetailModal'
import ReferralFormModal from '../components/Referrals/ReferralFormModal'
import ReferralDetailModal from '../components/Referrals/ReferralDetailModal'

const STATUS_FILTERS = [
  { value: 'all', label: 'Barcha' },
  { value: 'pending', label: 'Kutilmoqda' },
  { value: 'accepted', label: 'Tasdiqlangan' },
  { value: 'rejected', label: 'Rad etilgan' },
]

const SOURCE_FILTERS = [
  { value: 'all', label: 'Barcha manbalar' },
  { value: 'public', label: 'Ochiq ariza' },
  { value: 'referral', label: 'Referal' },
]

function Candidates() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [showReferralDetailModal, setShowReferralDetailModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, sourceFilter])

  const fetchApplications = async () => {
    setLoading(true)
    const filters = {}
    if (statusFilter !== 'all') filters.status = statusFilter
    
    const result = await apiService.getApplicationSubmissions(filters)

    if (result.success) {
      let normalized = (result.data.applications || result.data.submissions || []).map((app) => ({
        ...app,
        id: app.id || app._id,
        vacancyName: app.vacancyId?.nom || 'Noma\'lum vakansiya',
        candidateName: getCandidateName(app),
        source: app.source || 'public',
      }))
      
      // Filter by source
      if (sourceFilter !== 'all') {
        normalized = normalized.filter((app) => app.source === sourceFilter)
      }
      
      setApplications(normalized)
    } else {
      showError(result.error || 'Arizalarni yuklashda xatolik')
    }
    setLoading(false)
  }

  const getCandidateName = (application) => {
    if (!application.answers || application.answers.length === 0) return 'Noma\'lum nomzod'
    
    // Ism va familiyani topish
    const nameAnswer = application.answers.find(
      (ans) => ans.question && (ans.question.toLowerCase().includes('ism') || ans.question.toLowerCase().includes('familiya'))
    )
    
    if (nameAnswer) {
      return nameAnswer.answer || 'Noma\'lum nomzod'
    }
    
    // Agar topilmasa, birinchi javobni olish
    if (application.answers.length > 0) {
      return application.answers[0].answer || 'Noma\'lum nomzod'
    }
    
    return 'Noma\'lum nomzod'
  }

  const handleStatusChange = async (application, newStatus) => {
    const applicationId = application.id || application._id
    setActionLoading(applicationId)
    
    const result = await apiService.updateApplicationSubmissionStatus(applicationId, newStatus)
    
    if (result.success) {
      showSuccess(`Ariza ${newStatus === 'accepted' ? 'tasdiqlandi' : newStatus === 'rejected' ? 'rad etildi' : 'yangilandi'}`)
      await fetchApplications()
    } else {
      showError(result.error || 'Ariza statusini yangilashda xatolik')
    }
    
    setActionLoading(null)
  }

  const handleInterviewClick = (application) => {
    if (application.status !== 'accepted') {
      showError('Faqat tasdiqlangan nomzodlar uchun intervyu belgilash mumkin')
      return
    }
    setSelectedApplication(application)
    setShowInterviewModal(true)
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
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'accepted':
        return 'Tasdiqlangan'
      case 'rejected':
        return 'Rad etilgan'
      case 'pending':
        return 'Kutilmoqda'
      default:
        return status
    }
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
                <div key={index} className="inline-block">
                  <img
                    src={item.startsWith('data:') ? item : `data:image/jpeg;base64,${item}`}
                    alt={`Rasm ${index + 1}`}
                    className="max-w-24 max-h-24 rounded-lg border border-gray-200 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      const modal = document.createElement('div')
                      modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4'
                      modal.onclick = () => modal.remove()
                      const img = document.createElement('img')
                      img.src = e.target.src
                      img.className = 'max-w-full max-h-[90vh] object-contain rounded-lg'
                      modal.appendChild(img)
                      document.body.appendChild(modal)
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'block'
                      }
                    }}
                  />
                  <span className="hidden px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                    Rasm yuklanmadi
                  </span>
                </div>
              )
            }
            return (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                {item}
              </span>
            )
          })}
        </div>
      )
    }
    
    // Base64 rasm tekshirish
    if (typeof answer.answer === 'string' && isBase64Image(answer.answer)) {
      const imageSrc = answer.answer.startsWith('data:') 
        ? answer.answer 
        : `data:image/jpeg;base64,${answer.answer}`
      
      return (
        <div className="mt-1">
          <img
            src={imageSrc}
            alt="Yuklangan rasm"
            className="max-w-32 max-h-32 rounded-lg border border-gray-200 object-contain cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              const modal = document.createElement('div')
              modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4'
              modal.onclick = () => modal.remove()
              const img = document.createElement('img')
              img.src = e.target.src
              img.className = 'max-w-full max-h-[90vh] object-contain rounded-lg'
              modal.appendChild(img)
              document.body.appendChild(modal)
            }}
            onError={(e) => {
              e.target.style.display = 'none'
              const errorDiv = document.createElement('div')
              errorDiv.className = 'text-red-500 text-xs'
              errorDiv.textContent = 'Rasm yuklanmadi'
              e.target.parentNode.appendChild(errorDiv)
            }}
          />
        </div>
      )
    }
    
    if (typeof answer.answer === 'string' && answer.answer.startsWith('http')) {
      return (
        <a
          href={answer.answer}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 underline break-all text-xs"
        >
          {answer.answer}
        </a>
      )
    }
    
    return <span className="text-gray-900 whitespace-pre-wrap break-words text-sm">{answer.answer || '—'}</span>
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
            <p className="text-sm uppercase tracking-wider text-gray-400">Nomzodlar</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Nomzodlar boshqaruvi</h1>
            <p className="text-gray-500 mt-2">Arizalarni ko'rib chiqing va tasdiqlang</p>
          </div>

        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-blue-600 text-white shadow shadow-blue-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <div className="flex flex-wrap items-center gap-2">
            {SOURCE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSourceFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  sourceFilter === filter.value
                    ? 'bg-purple-600 text-white shadow shadow-purple-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
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
      ) : applications.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Arizalar topilmadi</h3>
          <p className="text-gray-500">Hozircha arizalar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{application.candidateName}</h3>
                    {application.source === 'referral' && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                        Referal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{application.vacancyName}</p>
                  {application.source === 'referral' && application.referralEmployeeId && (
                    <p className="text-xs text-purple-600 mt-1">
                      Taklif qilgan: {application.referralEmployeeId.firstName} {application.referralEmployeeId.lastName}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                  {getStatusLabel(application.status)}
                </span>
              </div>

              {application.answers && application.answers.length > 0 && (
                <div className="space-y-2 mb-4">
                  {application.answers.slice(0, 3).map((answer, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-500 font-medium">{answer.question}:</span>
                      <div className="text-gray-900 ml-2 mt-1">
                        {renderAnswer(answer)}
                      </div>
                    </div>
                  ))}
                  {application.answers.length > 3 && (
                    <p className="text-xs text-gray-400">+{application.answers.length - 3} boshqa javob</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Yuborilgan: {formatDate(application.createdAt)}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedApplication(application)
                    if (application.source === 'referral') {
                      setShowReferralDetailModal(true)
                    } else {
                      setShowDetailModal(true)
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-600 rounded-lg hover:bg-gray-500 hover:text-white transition-colors"
                >
                  Ko'rish
                </button>
                {application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(application, 'accepted')}
                      disabled={actionLoading === application.id}
                      className="flex-1 px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {actionLoading === application.id ? 'Kutilmoqda...' : 'Tasdiqlash'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(application, 'rejected')}
                      disabled={actionLoading === application.id}
                      className="flex-1 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Rad etish
                    </button>
                  </>
                )}
                {application.status === 'accepted' && (
                  <button
                    onClick={() => handleInterviewClick(application)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    Intervyu belgilash
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showInterviewModal && selectedApplication && (
        <InterviewFormModal
          application={selectedApplication}
          onClose={() => {
            setShowInterviewModal(false)
            setSelectedApplication(null)
          }}
          onSuccess={() => {
            fetchApplications()
            setShowInterviewModal(false)
            setSelectedApplication(null)
          }}
        />
      )}

      {showDetailModal && selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedApplication(null)
          }}
        />
      )}

      {showReferralModal && (
        <ReferralFormModal
          onClose={() => setShowReferralModal(false)}
          onSuccess={() => {
            fetchApplications()
            setShowReferralModal(false)
          }}
        />
      )}

      {showReferralDetailModal && selectedApplication && (
        <ReferralDetailModal
          referral={selectedApplication}
          onClose={() => {
            setShowReferralDetailModal(false)
            setSelectedApplication(null)
          }}
        />
      )}
    </div>
  )
}

export default Candidates

