import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchableSelect from '../Common/SearchableSelect'
import QuillEditor from '../Common/QuillEditor'
import { useSnackbar } from '../../contexts/SnackbarContext'

const TYPE_OPTIONS = [
  { value: 'fulltime', label: "To'liq stavka" },
  { value: 'parttime', label: 'Yarim stavka' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Faol' },
  { value: 'close', label: 'Yopiq' },
]

function VacancyForm({ vacancy, departments = [], positions = [], schedules = [], onClose, onSubmit, loading }) {
  const { showError } = useSnackbar()
  const [formData, setFormData] = useState({
    nom: '',
    departmentId: '',
    positionId: '',
    workScheduleId: '',
    daraja: '',
    type: '',
    oylik: '',
    description: '',
    responsibilities: '',
    preferences: '',
    skills: [],
    status: 'active',
    minAge: '',
    maxAge: '',
  })
  const [errors, setErrors] = useState({})
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    if (vacancy) {
      setFormData({
        nom: vacancy.nom || '',
        departmentId: vacancy.departmentId?._id || vacancy.departmentId || vacancy.department?._id || '',
        positionId: vacancy.positionId?._id || vacancy.positionId || vacancy.position?._id || '',
        workScheduleId: vacancy.workScheduleId?._id || vacancy.workScheduleId || '',
        daraja: vacancy.daraja || '',
        type: vacancy.type || '',
        oylik: vacancy.oylik || '',
        description: vacancy.description || '',
        responsibilities: vacancy.responsibilities || '',
        preferences: vacancy.preferences || '',
        skills: vacancy.skills || [],
        status: vacancy.status || 'active',
        minAge: vacancy.minAge || '',
        maxAge: vacancy.maxAge || '',
      })
    } else {
      setFormData({
        nom: '',
        departmentId: '',
        positionId: '',
        workScheduleId: '',
        daraja: '',
        type: '',
        oylik: '',
        description: '',
        responsibilities: '',
        preferences: '',
        skills: [],
        status: 'active',
        minAge: '',
        maxAge: '',
      })
    }
  }, [vacancy])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    // For age fields, only allow numbers
    if ((name === 'minAge' || name === 'maxAge') && value !== '') {
      const numValue = parseInt(value, 10)
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        return
      }
      setFormData((prev) => ({ ...prev, [name]: numValue.toString() }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSkillAdd = () => {
    const value = skillInput.trim()
    if (!value) return
    if (formData.skills.includes(value)) {
      setSkillInput('')
      return
    }
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, value] }))
    setSkillInput('')
  }

  const handleSkillRemove = (skill) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((item) => item !== skill) }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.nom.trim()) newErrors.nom = 'Vakansiya nomi majburiy'
    if (!formData.departmentId) newErrors.departmentId = "Bo'lim tanlanishi shart"
    if (!formData.positionId) newErrors.positionId = 'Lavozim tanlanishi shart'
    if (!formData.workScheduleId) newErrors.workScheduleId = 'Ish grafigi tanlanishi shart'
    if (!formData.daraja.trim()) newErrors.daraja = 'Daraja kiritilishi shart'
    if (!formData.type) newErrors.type = 'Ish turi tanlanishi shart'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Show first validation error in snackbar
      const firstError = Object.values(validationErrors)[0]
      if (firstError) {
        showError(firstError)
      }
      return
    }

    const basePayload = {
      nom: formData.nom.trim(),
      departmentId: formData.departmentId,
      positionId: formData.positionId,
      workScheduleId: formData.workScheduleId,
      daraja: formData.daraja,
      type: formData.type,
      oylik: formData.oylik,
      description: formData.description,
      responsibilities: formData.responsibilities,
      preferences: formData.preferences,
      skills: formData.skills,
      ...(formData.minAge && { minAge: parseInt(formData.minAge, 10) }),
      ...(formData.maxAge && { maxAge: parseInt(formData.maxAge, 10) }),
    }

    const payload = vacancy ? basePayload : { ...basePayload, status: formData.status }
    onSubmit(payload)
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {vacancy ? 'Vakansiyani tahrirlash' : 'Yangi vakansiya'}
              </h2>
              <p className="text-sm text-gray-500">Vakansiya ma'lumotlarini to'ldiring</p>
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
                  Vakansiya nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nom ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Vakansiya nomini kiriting"
                />
                {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daraja <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="daraja"
                  value={formData.daraja}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.daraja ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Darajani kiriting"
                />
                {errors.daraja && <p className="mt-1 text-sm text-red-500">{errors.daraja}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bo'lim <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={departments.map((dept) => ({
                    id: dept.id || dept._id,
                    label: dept.nom,
                  }))}
                  value={formData.departmentId}
                  onChange={(value) => handleSelectChange('departmentId', value)}
                  placeholder="Bo'limni tanlang"
                  error={errors.departmentId}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lavozim <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={positions.map((position) => ({
                    id: position.id || position._id,
                    label: position.nom,
                  }))}
                  value={formData.positionId}
                  onChange={(value) => handleSelectChange('positionId', value)}
                  placeholder="Lavozimni tanlang"
                  error={errors.positionId}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ish grafigi <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={schedules.map((schedule) => ({
                    id: schedule.id || schedule._id,
                    label: schedule.nom,
                  }))}
                  value={formData.workScheduleId}
                  onChange={(value) => handleSelectChange('workScheduleId', value)}
                  placeholder="Ish grafigini tanlang"
                  error={errors.workScheduleId}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ish turi <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.type ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Ish turini tanlang</option>
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oylik diapazoni
                </label>
                <input
                  type="text"
                  name="oylik"
                  value={formData.oylik}
                  onChange={handleInputChange}
                  placeholder="Oylik maoshni kiriting"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {!vacancy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimal yosh
                </label>
                <input
                  type="number"
                  name="minAge"
                  value={formData.minAge}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  placeholder="Minimal yoshni kiriting"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimal yosh
                </label>
                <input
                  type="number"
                  name="maxAge"
                  value={formData.maxAge}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  placeholder="Maksimal yoshni kiriting"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ko'nikmalar
              </label>
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSkillAdd()
                      }
                    }}
                    placeholder="Ko'nikma nomini kiriting"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSkillAdd}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Qo'shish
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="w-full flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button type="button" onClick={() => handleSkillRemove(skill)} className="text-blue-500 hover:text-blue-700">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Vakansiya tavsifi
                </label>
                <QuillEditor
                  key={`description-${vacancy?.id || 'new'}`}
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Vakansiya haqida ma'lumot kiriting"
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Majburiyatlar
                </label>
                <QuillEditor
                  key={`responsibilities-${vacancy?.id || 'new'}`}
                  value={formData.responsibilities}
                  onChange={(value) => setFormData((prev) => ({ ...prev, responsibilities: value }))}
                  placeholder="Majburiyatlarni kiriting"
                  className="min-h-[200px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Afzal ko'riladigan talablar
              </label>
              <QuillEditor
                key={`preferences-${vacancy?.id || 'new'}`}
                value={formData.preferences}
                onChange={(value) => setFormData((prev) => ({ ...prev, preferences: value }))}
                placeholder="Afzal ko'riladigan talablarni kiriting"
                className="min-h-[200px]"
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
                {loading ? 'Saqlanmoqda...' : vacancy ? 'Yangilash' : 'Yaratish'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VacancyForm

