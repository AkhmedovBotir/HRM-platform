import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DAYS = [
  { key: 'monday', label: 'Dushanba' },
  { key: 'tuesday', label: 'Seshanba' },
  { key: 'wednesday', label: 'Chorshanba' },
  { key: 'thursday', label: 'Payshanba' },
  { key: 'friday', label: 'Juma' },
  { key: 'saturday', label: 'Shanba' },
  { key: 'sunday', label: 'Yakshanba' },
]

function ScheduleTemplateForm({ template, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    nom: '',
    status: 'active',
    monday: { startTime: '09:00', endTime: '18:00', isWorking: true },
    tuesday: { startTime: '09:00', endTime: '18:00', isWorking: true },
    wednesday: { startTime: '09:00', endTime: '18:00', isWorking: true },
    thursday: { startTime: '09:00', endTime: '18:00', isWorking: true },
    friday: { startTime: '09:00', endTime: '18:00', isWorking: true },
    saturday: { startTime: null, endTime: null, isWorking: false },
    sunday: { startTime: null, endTime: null, isWorking: false },
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (template) {
      setFormData({
        nom: template.nom || '',
        status: template.status || 'active',
        monday: template.monday || { startTime: null, endTime: null, isWorking: false },
        tuesday: template.tuesday || { startTime: null, endTime: null, isWorking: false },
        wednesday: template.wednesday || { startTime: null, endTime: null, isWorking: false },
        thursday: template.thursday || { startTime: null, endTime: null, isWorking: false },
        friday: template.friday || { startTime: null, endTime: null, isWorking: false },
        saturday: template.saturday || { startTime: null, endTime: null, isWorking: false },
        sunday: template.sunday || { startTime: null, endTime: null, isWorking: false },
      })
    }
  }, [template])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.nom.trim()) {
      newErrors.nom = 'Shablon nomi to\'ldirilishi shart'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleDayChange = (dayKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }))
  }

  const handleWorkingToggle = (dayKey) => {
    setFormData((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isWorking: !prev[dayKey].isWorking,
        startTime: !prev[dayKey].isWorking ? '09:00' : null,
        endTime: !prev[dayKey].isWorking ? '18:00' : null,
      },
    }))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              {template ? 'Shablonni Tahrirlash' : 'Yangi Shablon Qo\'shish'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shablon nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Hafta kunlari</h3>
                {DAYS.map((day) => (
                  <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[day.key].isWorking}
                          onChange={() => handleWorkingToggle(day.key)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-900">{day.label}</span>
                      </label>
                    </div>
                    {formData[day.key].isWorking && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Boshlanish vaqti</label>
                          <input
                            type="time"
                            value={formData[day.key].startTime || ''}
                            onChange={(e) => handleDayChange(day.key, 'startTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Tugash vaqti</label>
                          <input
                            type="time"
                            value={formData[day.key].endTime || ''}
                            onChange={(e) => handleDayChange(day.key, 'endTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Bekor Qilish
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {loading ? 'Saqlanmoqda...' : template ? 'Yangilash' : 'Yaratish'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ScheduleTemplateForm






