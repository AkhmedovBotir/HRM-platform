import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../../services/api'
import { useSnackbar } from '../../contexts/SnackbarContext'

const QUESTION_TYPES = [
  { value: 'text', label: 'Matn' },
  { value: 'textarea', label: 'Uzun matn' },
  { value: 'number', label: 'Son' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefon' },
  { value: 'select', label: 'Tanlov (dropdown)' },
  { value: 'radio', label: 'Radio button' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Sana' },
  { value: 'file', label: 'Fayl' },
]

function ApplicationFormModal({ vacancy, onClose }) {
  const { showError, showSuccess } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    questions: [],
    status: 'active',
  })
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questionForm, setQuestionForm] = useState({
    question: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: [],
    order: 0,
  })
  const [newOption, setNewOption] = useState('')

  useEffect(() => {
    if (vacancy) {
      fetchApplicationForm()
    }
  }, [vacancy])

  const fetchApplicationForm = async () => {
    if (!vacancy) return
    setLoading(true)
    const vacancyId = vacancy.id || vacancy._id
    const result = await apiService.getApplicationForms({ vacancyId })

    if (result.success && result.data?.forms && result.data.forms.length > 0) {
      const form = result.data.forms[0]
      setFormData({
        nom: form.nom || '',
        questions: (form.questions || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
        status: form.status || 'active',
      })
    } else {
      // Yangi form yaratish uchun
      setFormData({
        nom: `${vacancy.nom} uchun so'rovnoma`,
        questions: [],
        status: 'active',
      })
    }
    setLoading(false)
  }

  const handleAddQuestion = () => {
    if (!questionForm.question.trim()) {
      showError('Savol matnini kiriting')
      return
    }

    // select, radio, checkbox uchun options tekshirish
    if (['select', 'radio', 'checkbox'].includes(questionForm.type) && questionForm.options.length === 0) {
      showError(`${QUESTION_TYPES.find(t => t.value === questionForm.type)?.label} turi uchun kamida bitta variant qo'shing`)
      return
    }

    const newQuestion = {
      ...questionForm,
      order: formData.questions.length,
    }

    if (editingQuestion !== null) {
      // Tahrirlash
      const updatedQuestions = [...formData.questions]
      updatedQuestions[editingQuestion] = newQuestion
      setFormData({ ...formData, questions: updatedQuestions })
      setEditingQuestion(null)
    } else {
      // Yangi qo'shish
      setFormData({
        ...formData,
        questions: [...formData.questions, newQuestion],
      })
    }

    // Formani tozalash
    setQuestionForm({
      question: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: [],
      order: 0,
    })
    setNewOption('')
  }

  const handleEditQuestion = (index) => {
    const question = formData.questions[index]
    setQuestionForm({
      question: question.question || '',
      type: question.type || 'text',
      required: question.required || false,
      placeholder: question.placeholder || '',
      options: [...(question.options || [])],
      order: question.order || index,
    })
    setEditingQuestion(index)
  }

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index)
    // Order'larni yangilash
    const reorderedQuestions = updatedQuestions.map((q, i) => ({ ...q, order: i }))
    setFormData({ ...formData, questions: reorderedQuestions })
    if (editingQuestion === index) {
      setEditingQuestion(null)
      setQuestionForm({
        question: '',
        type: 'text',
        required: false,
        placeholder: '',
        options: [],
        order: 0,
      })
    }
  }

  const handleMoveQuestion = (index, direction) => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === formData.questions.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updatedQuestions = [...formData.questions]
    const temp = updatedQuestions[index]
    updatedQuestions[index] = updatedQuestions[newIndex]
    updatedQuestions[newIndex] = temp

    // Order'larni yangilash
    const reorderedQuestions = updatedQuestions.map((q, i) => ({ ...q, order: i }))
    setFormData({ ...formData, questions: reorderedQuestions })
  }

  const handleAddOption = () => {
    if (!newOption.trim()) return
    if (questionForm.options.includes(newOption.trim())) {
      showError('Bu variant allaqachon mavjud')
      return
    }
    setQuestionForm({
      ...questionForm,
      options: [...questionForm.options, newOption.trim()],
    })
    setNewOption('')
  }

  const handleRemoveOption = (option) => {
    setQuestionForm({
      ...questionForm,
      options: questionForm.options.filter((o) => o !== option),
    })
  }

  const handleSubmit = async () => {
    if (!formData.nom.trim()) {
      showError('So\'rovnoma nomini kiriting')
      return
    }

    if (formData.questions.length === 0) {
      showError('Kamida bitta savol qo\'shing')
      return
    }

    setFormLoading(true)
    const vacancyId = vacancy.id || vacancy._id
    const payload = {
      vacancyId,
      nom: formData.nom.trim(),
      questions: formData.questions,
      status: formData.status,
    }

    // Mavjud form bor-yo'qligini tekshirish
    const existingFormResult = await apiService.getApplicationForms({ vacancyId })
    let result

    if (existingFormResult.success && existingFormResult.data?.forms && existingFormResult.data.forms.length > 0) {
      // Yangilash
      const formId = existingFormResult.data.forms[0]._id || existingFormResult.data.forms[0].id
      result = await apiService.updateApplicationForm(formId, {
        nom: payload.nom,
        questions: payload.questions,
      })
    } else {
      // Yaratish
      result = await apiService.createApplicationForm(payload)
    }

    if (result.success) {
      showSuccess('So\'rovnoma muvaffaqiyatli saqlandi')
      onClose()
    } else {
      showError(result.error || 'So\'rovnomani saqlashda xatolik yuz berdi')
    }
    setFormLoading(false)
  }

  const handleStatusChange = async (newStatus) => {
    const vacancyId = vacancy.id || vacancy._id
    const existingFormResult = await apiService.getApplicationForms({ vacancyId })

    if (!existingFormResult.success || !existingFormResult.data?.forms || existingFormResult.data.forms.length === 0) {
      showError('So\'rovnoma topilmadi')
      return
    }

    const formId = existingFormResult.data.forms[0]._id || existingFormResult.data.forms[0].id
    const result = await apiService.updateApplicationFormStatus(formId, newStatus)

    if (result.success) {
      setFormData({ ...formData, status: newStatus })
      showSuccess('So\'rovnoma statusi yangilandi')
    } else {
      showError(result.error || 'Statusni yangilashda xatolik yuz berdi')
    }
  }

  const needsOptions = ['select', 'radio', 'checkbox'].includes(questionForm.type)
  const needsPlaceholder = !['radio', 'checkbox', 'date'].includes(questionForm.type)

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        >
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">So'rovnoma boshqaruvi</h2>
              <p className="text-sm text-gray-500">{vacancy?.nom}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                formData.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {formData.status === 'active' ? 'Faol' : 'Nofaol'}
              </span>
              <button
                onClick={() => handleStatusChange(formData.status === 'active' ? 'inactive' : 'active')}
                className="px-4 py-2 rounded-xl border border-purple-100 text-purple-600 font-medium hover:bg-purple-50 transition-colors text-sm"
              >
                {formData.status === 'active' ? 'Nofaollashtirish' : 'Faollashtirish'}
              </button>
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
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Form nomi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                So'rovnoma nomi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="So'rovnoma nomini kiriting"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Savollar ro'yxati */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Savollar ({formData.questions.length})</h3>
              {formData.questions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>Hozircha savollar yo'q</p>
                  <p className="text-sm mt-2">Quyida yangi savol qo'shing</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.questions.map((q, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-xl ${
                        editingQuestion === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded">
                              {index + 1}
                            </span>
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                              {QUESTION_TYPES.find((t) => t.value === q.type)?.label}
                            </span>
                            {q.required && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                                Majburiy
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-gray-900">{q.question}</p>
                          {q.placeholder && (
                            <p className="text-sm text-gray-500 mt-1">Placeholder: {q.placeholder}</p>
                          )}
                          {q.options && q.options.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {q.options.map((opt, optIndex) => (
                                <span
                                  key={optIndex}
                                  className="px-2 py-1 bg-white border border-gray-200 text-sm rounded"
                                >
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveQuestion(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                            title="Yuqoriga ko'tarish"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMoveQuestion(index, 'down')}
                            disabled={index === formData.questions.length - 1}
                            className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                            title="Pastga tushirish"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditQuestion(index)}
                            className="p-1.5 text-blue-600 hover:text-blue-700"
                            title="Tahrirlash"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="p-1.5 text-red-600 hover:text-red-700"
                            title="O'chirish"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Yangi savol qo'shish */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingQuestion !== null ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Savol matni <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                    placeholder="Savolni kiriting"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Savol turi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={questionForm.type}
                      onChange={(e) => {
                        const newType = e.target.value
                        setQuestionForm({
                          ...questionForm,
                          type: newType,
                          // Agar options kerak bo'lmasa, tozalash
                          options: ['select', 'radio', 'checkbox'].includes(newType) ? questionForm.options : [],
                        })
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {QUESTION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={questionForm.required}
                        onChange={(e) => setQuestionForm({ ...questionForm, required: e.target.checked })}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Majburiy savol</span>
                    </label>
                  </div>
                </div>

                {needsPlaceholder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                    <input
                      type="text"
                      value={questionForm.placeholder}
                      onChange={(e) => setQuestionForm({ ...questionForm, placeholder: e.target.value })}
                      placeholder="Placeholder matnini kiriting"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {needsOptions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variantlar <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddOption()
                          }
                        }}
                        placeholder="Yangi variant qo'shish"
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                      >
                        Qo'shish
                      </button>
                    </div>
                    {questionForm.options.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {questionForm.options.map((opt, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-2"
                          >
                            {opt}
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(opt)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    {editingQuestion !== null ? 'Yangilash' : 'Qo\'shish'}
                  </button>
                  {editingQuestion !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestion(null)
                        setQuestionForm({
                          question: '',
                          type: 'text',
                          required: false,
                          placeholder: '',
                          options: [],
                          order: 0,
                        })
                        setNewOption('')
                      }}
                      className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Bekor qilish
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Saqlash tugmalari */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                disabled={formLoading}
              >
                Bekor qilish
              </button>
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: formLoading ? 1 : 1.02 }}
                whileTap={{ scale: formLoading ? 1 : 0.98 }}
                disabled={formLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-60"
              >
                {formLoading ? 'Saqlanmoqda...' : 'Saqlash'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ApplicationFormModal

