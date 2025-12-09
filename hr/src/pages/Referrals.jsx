import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import ReferralFormModal from '../components/Referrals/ReferralFormModal'
import ReferralDetailModal from '../components/Referrals/ReferralDetailModal'

const STATUS_FILTERS = [
  { value: 'all', label: 'Barcha' },
  { value: 'pending', label: 'Kutilmoqda' },
  { value: 'reviewed', label: 'Ko\'rib chiqilgan' },
  { value: 'accepted', label: 'Tasdiqlangan' },
  { value: 'rejected', label: 'Rad etilgan' },
]

function Referrals() {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedReferral, setSelectedReferral] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchReferrals()
  }, [statusFilter])

  const fetchReferrals = async () => {
    setLoading(true)
    const filters = statusFilter !== 'all' ? { status: statusFilter } : {}
    const result = await apiService.getReferrals(filters)

    if (result.success) {
      const normalized = (result.data.referrals || []).map((ref) => ({
        ...ref,
        id: ref.id || ref._id,
        vacancyName: ref.vacancyId?.nom || 'Noma\'lum vakansiya',
        candidateName: getCandidateName(ref),
      }))
      setReferrals(normalized)
    } else {
      showError(result.error || 'Referallarni yuklashda xatolik')
    }
    setLoading(false)
  }

  const getCandidateName = (referral) => {
    if (!referral.answers || referral.answers.length === 0) return 'Noma\'lum nomzod'
    
    const nameAnswer = referral.answers.find(
      (ans) => ans.question && (ans.question.toLowerCase().includes('ism') || ans.question.toLowerCase().includes('familiya') || ans.question.toLowerCase().includes('f.i.o'))
    )
    
    if (nameAnswer) {
      return nameAnswer.answer || 'Noma\'lum nomzod'
    }
    
    if (referral.answers.length > 0) {
      return referral.answers[0].answer || 'Noma\'lum nomzod'
    }
    
    return 'Noma\'lum nomzod'
  }

  const handleStatusChange = async (referral, newStatus) => {
    const referralId = referral.id || referral._id
    setActionLoading(referralId)
    
    const result = await apiService.updateApplicationSubmissionStatus(referralId, newStatus)
    
    if (result.success) {
      showSuccess(`Ariza ${newStatus === 'accepted' ? 'tasdiqlandi' : newStatus === 'rejected' ? 'rad etildi' : 'yangilandi'}`)
      await fetchReferrals()
    } else {
      showError(result.error || 'Ariza statusini yangilashda xatolik')
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'reviewed':
        return 'bg-blue-100 text-blue-700'
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
      case 'reviewed':
        return 'Ko\'rib chiqilgan'
      default:
        return status
    }
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
            <p className="text-sm uppercase tracking-wider text-gray-400">Referallar</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Referal arizalar</h1>
            <p className="text-gray-500 mt-2">Xodimlar orqali taklif qilingan nomzodlar</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFormModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-purple-500/30"
          >
            Referal yuborish
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-purple-600 text-white shadow shadow-purple-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
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
      ) : referrals.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Referallar topilmadi</h3>
          <p className="text-gray-500 mb-4">Hozircha referal arizalar mavjud emas</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFormModal(true)}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium"
          >
            Birinchi referalni yuborish
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {referrals.map((referral) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{referral.candidateName}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{referral.vacancyName}</p>
                  {referral.referralEmployeeId && (
                    <p className="text-xs text-purple-600 mt-1">
                      Taklif qilgan: {referral.referralEmployeeId.firstName} {referral.referralEmployeeId.lastName}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                  {getStatusLabel(referral.status)}
                </span>
              </div>

              {referral.referralNote && (
                <div className="mb-4 p-3 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-600 font-medium mb-1">Izoh:</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{referral.referralNote}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Yuborilgan: {formatDate(referral.createdAt)}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedReferral(referral)
                    setShowDetailModal(true)
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-600 rounded-lg hover:bg-gray-500 hover:text-white transition-colors"
                >
                  Ko'rish
                </button>
                {referral.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(referral, 'accepted')}
                      disabled={actionLoading === referral.id}
                      className="flex-1 px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {actionLoading === referral.id ? 'Kutilmoqda...' : 'Tasdiqlash'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(referral, 'rejected')}
                      disabled={actionLoading === referral.id}
                      className="flex-1 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Rad etish
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showFormModal && (
        <ReferralFormModal
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            fetchReferrals()
            setShowFormModal(false)
          }}
        />
      )}

      {showDetailModal && selectedReferral && (
        <ReferralDetailModal
          referral={selectedReferral}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedReferral(null)
          }}
        />
      )}
    </div>
  )
}

export default Referrals



