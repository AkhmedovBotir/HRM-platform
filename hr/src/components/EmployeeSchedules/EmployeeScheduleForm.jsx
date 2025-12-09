import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchableSelect from '../Common/SearchableSelect'

function EmployeeScheduleForm({ schedule, employees, templates, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    templateId: '',
    startDate: '',
    endDate: '',
    status: 'active',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (schedule) {
      setFormData({
        employeeId: schedule.employeeId || '',
        templateId: schedule.templateId || '',
        startDate: schedule.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : '',
        endDate: schedule.endDate ? new Date(schedule.endDate).toISOString().split('T')[0] : '',
        status: schedule.status || 'active',
      })
    }
  }, [schedule])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.employeeId) {
      newErrors.employeeId = 'Xodim tanlanishi shart'
    }
    if (!formData.templateId) {
      newErrors.templateId = 'Shablon tanlanishi shart'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Boshlanish sanasi to\'ldirilishi shart'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const submitData = {
      employeeId: formData.employeeId,
      templateId: formData.templateId,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
    }
    onSubmit(submitData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto my-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              {schedule ? 'Grafikni Tahrirlash' : 'Yangi Grafik Qo\'shish'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-visible">
              <div className="relative" style={{ zIndex: 10003 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xodim <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={employees.map(emp => ({
                    id: emp.id,
                    label: `${emp.firstName} ${emp.lastName} ${emp.middleName}`,
                  }))}
                  value={formData.employeeId}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, employeeId: value }))
                    if (errors.employeeId) {
                      setErrors((prev) => ({ ...prev, employeeId: '' }))
                    }
                  }}
                  placeholder="Xodimni tanlang"
                  disabled={!!schedule}
                  zIndex={10003}
                />
                {errors.employeeId && <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>}
              </div>

              <div className="relative" style={{ zIndex: 10002 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shablon <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={templates.map(t => ({
                    id: t.id,
                    label: t.nom,
                  }))}
                  value={formData.templateId}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, templateId: value }))
                    if (errors.templateId) {
                      setErrors((prev) => ({ ...prev, templateId: '' }))
                    }
                  }}
                  placeholder="Shablonni tanlang"
                  zIndex={10002}
                />
                {errors.templateId && <p className="mt-1 text-sm text-red-500">{errors.templateId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boshlanish sanasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tugash sanasi (ixtiyoriy)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  {loading ? 'Saqlanmoqda...' : schedule ? 'Yangilash' : 'Yaratish'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EmployeeScheduleForm

