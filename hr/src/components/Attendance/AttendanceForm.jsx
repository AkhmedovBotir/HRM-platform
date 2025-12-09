import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function AttendanceForm({ show, onClose, onSubmit, attendance, selectedCell, employees, onDelete }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    checkIn: '',
    checkOut: '',
    status: 'present',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (attendance) {
      // Format dates for input fields
      let dateStr = ''
      if (attendance.date) {
        try {
          const date = new Date(attendance.date)
          if (!isNaN(date.getTime())) {
            dateStr = date.toISOString().split('T')[0]
          }
        } catch (e) {
          console.error('Error parsing date:', e)
        }
      }

      let checkInTime = ''
      if (attendance.checkIn) {
        try {
          const checkInDate = new Date(attendance.checkIn)
          if (!isNaN(checkInDate.getTime())) {
            // Get local time in HH:MM format
            const hours = String(checkInDate.getHours()).padStart(2, '0')
            const minutes = String(checkInDate.getMinutes()).padStart(2, '0')
            checkInTime = `${hours}:${minutes}`
          }
        } catch (e) {
          console.error('Error parsing checkIn:', e)
        }
      }

      let checkOutTime = ''
      if (attendance.checkOut) {
        try {
          const checkOutDate = new Date(attendance.checkOut)
          if (!isNaN(checkOutDate.getTime())) {
            // Get local time in HH:MM format
            const hours = String(checkOutDate.getHours()).padStart(2, '0')
            const minutes = String(checkOutDate.getMinutes()).padStart(2, '0')
            checkOutTime = `${hours}:${minutes}`
          }
        } catch (e) {
          console.error('Error parsing checkOut:', e)
        }
      }

      setFormData({
        employeeId: attendance.employeeId || '',
        date: dateStr,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        status: attendance.status || 'present',
        notes: attendance.notes || '',
      })
    } else if (selectedCell) {
      setFormData({
        employeeId: selectedCell.employeeId || '',
        date: selectedCell.date || '',
        checkIn: '',
        checkOut: '',
        status: 'present',
        notes: '',
      })
    } else {
      setFormData({
        employeeId: '',
        date: '',
        checkIn: '',
        checkOut: '',
        status: 'present',
        notes: '',
      })
    }
  }, [attendance, selectedCell, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}
    if (!formData.employeeId) {
      newErrors.employeeId = 'Xodim tanlanishi shart'
    }
    if (!formData.date) {
      newErrors.date = 'Sana tanlanishi shart'
    }
    if (!formData.status) {
      newErrors.status = 'Status tanlanishi shart'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Format data for API
    // Format checkIn and checkOut to ISO string if provided
    let checkInISO = null
    let checkOutISO = null
    
    if (formData.checkIn && formData.checkIn.trim()) {
      // Time input returns "HH:MM" format, convert to ISO
      // Create date string in local timezone, then convert to ISO
      const [hours, minutes] = formData.checkIn.split(':')
      // Create date object with local date and time
      const localDate = new Date(`${formData.date}T${hours}:${minutes}:00`)
      // Convert to ISO string (UTC)
      checkInISO = localDate.toISOString()
    }
    
    if (formData.checkOut && formData.checkOut.trim()) {
      // Time input returns "HH:MM" format, convert to ISO
      const [hours, minutes] = formData.checkOut.split(':')
      // Create date object with local date and time
      const localDate = new Date(`${formData.date}T${hours}:${minutes}:00`)
      // Convert to ISO string (UTC)
      checkOutISO = localDate.toISOString()
    }

    const submitData = {
      employeeId: formData.employeeId,
      date: formData.date,
      checkIn: checkInISO,
      checkOut: checkOutISO,
      status: formData.status,
      notes: formData.notes && formData.notes.trim() ? formData.notes.trim() : null,
    }


    onSubmit(submitData)
  }

  if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                {attendance ? 'Davomatni Tahrirlash' : 'Yangi Davomat Qo\'shish'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xodim <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    disabled={selectedCell !== null}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.employeeId ? 'border-red-500' : 'border-gray-300'
                    } ${selectedCell ? 'bg-gray-100' : ''}`}
                    required
                  >
                    <option value="">Xodimni tanlang</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} {emp.middleName}
                      </option>
                    ))}
                  </select>
                  {errors.employeeId && (
                    <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sana <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    disabled={selectedCell !== null}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    } ${selectedCell ? 'bg-gray-100' : ''}`}
                    required
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kirish Vaqti
                  </label>
                  <input
                    type="time"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chiqish Vaqti
                  </label>
                  <input
                    type="time"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Holati <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="present">Ishda</option>
                    <option value="absent">Yo'q</option>
                    <option value="late">Kech kelgan</option>
                    <option value="half_day">Yarim kun</option>
                    <option value="leave">Ta'til</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                  )}
                </div>

                {(formData.status === 'absent' || formData.status === 'late' || formData.status === 'leave' || formData.status === 'half_day') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Izoh
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Izoh kiriting..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                )}

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
                  {attendance && onDelete && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onDelete}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      O'chirish
                    </motion.button>
                  )}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                  >
                    {attendance ? 'Yangilash' : 'Yaratish'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AttendanceForm

