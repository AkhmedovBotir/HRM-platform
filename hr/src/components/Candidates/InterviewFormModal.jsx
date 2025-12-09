import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../../services/api'
import { useSnackbar } from '../../contexts/SnackbarContext'

function InterviewFormModal({ application, onClose, onSuccess }) {
  const { showError, showSuccess } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    interviewDate: '',
    interviewTime: '',
    location: '',
    interviewer: '',
    notes: '',
    status: 'scheduled',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.interviewDate) {
      showError('Intervyu sanasini kiriting')
      return
    }

    if (!formData.interviewTime) {
      showError('Intervyu vaqtini kiriting')
      return
    }

    if (!formData.location.trim()) {
      showError('Intervyu joylashuvini kiriting')
      return
    }

    // Sana o'tgan bo'lmasligini tekshirish
    const interviewDate = new Date(formData.interviewDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (interviewDate < today) {
      showError('Intervyu sanasi o\'tgan bo\'lishi mumkin emas')
      return
    }

    setLoading(true)
    const applicationId = application.id || application._id
    const vacancyId = application.vacancyId?._id || application.vacancyId?.id || application.vacancyId

    const payload = {
      vacancyId: vacancyId,
      applicationSubmissionId: applicationId,
      interviewDate: formData.interviewDate,
      interviewTime: formData.interviewTime,
      location: formData.location.trim(),
      interviewer: formData.interviewer.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    }

    const result = await apiService.createInterview(payload)

    if (result.success) {
      showSuccess('Intervyu muvaffaqiyatli belgilandi')
      onSuccess?.()
    } else {
      showError(result.error || 'Intervyu belgilashda xatolik yuz berdi')
    }

    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const candidateName = application.candidateName || 'Noma\'lum nomzod'
  const vacancyName = application.vacancyName || 'Noma\'lum vakansiya'

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Intervyu belgilash</h2>
              <p className="text-sm text-gray-500">
                {candidateName} • {vacancyName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervyu sanasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="interviewDate"
                  value={formData.interviewDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervyu vaqti <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="interviewTime"
                  value={formData.interviewTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervyu joylashuvi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Masalan: Ofis, Toshkent shahri, Amir Temur ko'chasi 1"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suhbat oluvchi
              </label>
              <input
                type="text"
                name="interviewer"
                value={formData.interviewer}
                onChange={handleInputChange}
                placeholder="Suhbat oluvchi ismini kiriting"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qo'shimcha izohlar
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Qo'shimcha ma'lumotlar yoki izohlar..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Bekor qilish
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-60"
              >
                {loading ? 'Saqlanmoqda...' : 'Belgilash'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default InterviewFormModal





