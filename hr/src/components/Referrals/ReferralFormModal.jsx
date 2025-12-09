import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../../services/api'
import { useSnackbar } from '../../contexts/SnackbarContext'
import SearchableSelect from '../Common/SearchableSelect'

function ReferralFormModal({ onClose, onSuccess }) {
  const { showError, showSuccess } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Data
  const [vacancies, setVacancies] = useState([])
  const [employees, setEmployees] = useState([])
  const [applicationForm, setApplicationForm] = useState(null)
  
  // Form data
  const [selectedVacancy, setSelectedVacancy] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [referralNote, setReferralNote] = useState('')
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedVacancy) {
      fetchApplicationForm(selectedVacancy)
    } else {
      setApplicationForm(null)
      setAnswers([])
    }
  }, [selectedVacancy])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const [vacanciesRes, employeesRes] = await Promise.all([
        apiService.getVacancies('active'),
        apiService.getReferralEmployees(),
      ])

      if (vacanciesRes.success) {
        const normalized = (vacanciesRes.data?.vacancies || []).map((v) => ({
          ...v,
          id: v.id || v._id,
        }))
        setVacancies(normalized)
      }

      if (employeesRes.success) {
        const normalized = (employeesRes.data?.employees || []).map((e) => ({
          ...e,
          id: e.id || e._id,
        }))
        setEmployees(normalized)
      }
    } catch (error) {
      console.error('Fetch initial data error:', error)
      showError('Ma\'lumotlarni yuklashda xatolik')
    }
    setLoading(false)
  }

  const fetchApplicationForm = async (vacancyId) => {
    try {
      const result = await apiService.getApplicationForms({ vacancyId })
      if (result.success && result.data?.forms && result.data.forms.length > 0) {
        const form = result.data.forms[0]
        setApplicationForm(form)
        // Initialize answers array
        const initialAnswers = (form.questions || []).map((q) => ({
          questionId: q._id || q.id,
          question: q.question,
          answer: '',
        }))
        setAnswers(initialAnswers)
      } else {
        setApplicationForm(null)
        setAnswers([])
        showError('Bu vakansiya uchun ariza formasi topilmadi')
      }
    } catch (error) {
      console.error('Fetch application form error:', error)
      showError('Ariza formasini yuklashda xatolik')
    }
  }

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = { ...newAnswers[index], answer: value }
    setAnswers(newAnswers)
  }

  const handleCheckboxChange = (index, option, checked) => {
    const newAnswers = [...answers]
    const currentAnswer = newAnswers[index].answer || []
    const answerArray = Array.isArray(currentAnswer) ? currentAnswer : []
    
    if (checked) {
      newAnswers[index] = { ...newAnswers[index], answer: [...answerArray, option] }
    } else {
      newAnswers[index] = { ...newAnswers[index], answer: answerArray.filter((a) => a !== option) }
    }
    setAnswers(newAnswers)
  }

  const handleFileChange = async (index, files) => {
    if (!files || files.length === 0) return

    const filePromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    try {
      const base64Files = await Promise.all(filePromises)
      const newAnswers = [...answers]
      // Agar bir nechta fayl bo'lsa array, bitta bo'lsa string
      newAnswers[index] = { 
        ...newAnswers[index], 
        answer: base64Files.length === 1 ? base64Files[0] : base64Files 
      }
      setAnswers(newAnswers)
    } catch (error) {
      console.error('File read error:', error)
      showError('Faylni o\'qishda xatolik')
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!selectedVacancy) {
      showError('Vakansiya tanlanishi shart')
      return
    }
    if (!selectedEmployee) {
      showError('Taklif qiluvchi xodim tanlanishi shart')
      return
    }
    if (!applicationForm) {
      showError('Ariza formasi topilmadi')
      return
    }

    // Check required questions
    const questions = applicationForm.questions || []
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const answer = answers[i]?.answer
      if (q.required) {
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          showError(`"${q.question}" savoli majburiy`)
          return
        }
      }
    }

    setSubmitting(true)
    const payload = {
      vacancyId: selectedVacancy,
      referralEmployeeId: selectedEmployee,
      referralNote: referralNote.trim(),
      answers: answers.map((a) => ({
        questionId: a.questionId,
        answer: a.answer,
      })),
    }

    const result = await apiService.submitReferral(payload)

    if (result.success) {
      showSuccess('Referal ariza muvaffaqiyatli yuborildi')
      onSuccess?.()
      onClose()
    } else {
      showError(result.error || 'Referal yuborishda xatolik')
    }
    setSubmitting(false)
  }

  const renderQuestionInput = (question, index) => {
    const answer = answers[index]?.answer || ''
    const { type, options = [], placeholder } = question

    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={placeholder || 'Javobingizni kiriting'}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={placeholder || 'Raqam kiriting'}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'email':
        return (
          <input
            type="email"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={placeholder || 'Email kiriting'}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'phone':
        return (
          <input
            type="tel"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={placeholder || 'Telefon raqam kiriting'}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'select':
        return (
          <select
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tanlang</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((opt, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={opt}
                  checked={answer === opt}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        const answerArray = Array.isArray(answer) ? answer : []
        return (
          <div className="space-y-2">
            {options.map((opt, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={answerArray.includes(opt)}
                  onChange={(e) => handleCheckboxChange(index, opt, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        )

      case 'file':
        const fileAnswer = answer
        const hasFile = fileAnswer && (typeof fileAnswer === 'string' || (Array.isArray(fileAnswer) && fileAnswer.length > 0))
        return (
          <div className="space-y-3">
            <input
              type="file"
              onChange={(e) => handleFileChange(index, e.target.files)}
              accept="image/*,.pdf,.doc,.docx"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {hasFile && (
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(fileAnswer) ? fileAnswer : [fileAnswer]).map((file, i) => (
                  <div key={i} className="relative">
                    {file.startsWith('data:image/') ? (
                      <img
                        src={file}
                        alt={`Yuklangan fayl ${i + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Fayl {i + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return (
          <input
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={placeholder || 'Javobingizni kiriting'}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
    }
  }

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
        >
          <div className="bg-white rounded-2xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Referal ariza yuborish</h2>
              <p className="text-sm text-gray-500">Xodim orqali nomzod taklif qiling</p>
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

          <div className="px-8 py-6 space-y-6">
            {/* Vakansiya tanlash */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vakansiya <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={vacancies.map((v) => ({
                  id: v.id,
                  label: v.nom,
                }))}
                value={selectedVacancy}
                onChange={setSelectedVacancy}
                placeholder="Vakansiyani tanlang"
              />
            </div>

            {/* Xodim tanlash */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taklif qiluvchi xodim <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={employees.map((e) => ({
                  id: e.id,
                  label: `${e.firstName} ${e.lastName}${e.positionId?.nom ? ` - ${e.positionId.nom}` : ''}`,
                }))}
                value={selectedEmployee}
                onChange={setSelectedEmployee}
                placeholder="Xodimni tanlang"
              />
            </div>

            {/* Izoh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Izoh (ixtiyoriy)
              </label>
              <textarea
                value={referralNote}
                onChange={(e) => setReferralNote(e.target.value)}
                placeholder="Nomzod haqida qo'shimcha ma'lumot..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Ariza formasi savollari */}
            {applicationForm && applicationForm.questions && applicationForm.questions.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ariza formasi</h3>
                <div className="space-y-5">
                  {applicationForm.questions
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((question, index) => (
                      <div key={question._id || question.id || index}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {question.question}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderQuestionInput(question, index)}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {selectedVacancy && !applicationForm && (
              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                <p>Bu vakansiya uchun ariza formasi mavjud emas</p>
                <p className="text-sm mt-1">Avval vakansiya uchun ariza formasi yarating</p>
              </div>
            )}

            {/* Saqlash tugmalari */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Bekor qilish
              </button>
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                disabled={submitting || !applicationForm}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-60"
              >
                {submitting ? 'Yuborilmoqda...' : 'Yuborish'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ReferralFormModal

