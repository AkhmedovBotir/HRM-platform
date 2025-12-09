import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import AttendanceForm from '../components/Attendance/AttendanceForm'
import DeleteAttendanceModal from '../components/Attendance/DeleteAttendanceModal'

function Attendance() {
  const [attendances, setAttendances] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [editingAttendance, setEditingAttendance] = useState(null)
  const [selectedCell, setSelectedCell] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAttendance, setDeletingAttendance] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    fetchAttendances()
  }, [currentDate])

  const fetchAttendances = async () => {
    setLoading(true)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`

    const result = await apiService.getAttendances({
      startDate,
      endDate,
    })

    if (result.success) {
      const normalizedAttendances = (result.data.attendances || []).map(att => ({
        ...att,
        id: att.id || att._id,
        employeeId: att.employeeId?._id || att.employeeId?.id || att.employeeId,
        employeeName: att.employeeId 
          ? `${att.employeeId.firstName || ''} ${att.employeeId.lastName || ''} ${att.employeeId.middleName || ''}`.trim()
          : att.employeeName || '',
      }))
      setAttendances(normalizedAttendances)
    } else {
      showError(result.error || 'Davomat ma\'lumotlarini yuklashda xatolik')
    }
    setLoading(false)
  }

  const fetchEmployees = async () => {
    const result = await apiService.getEmployees(false) // Only active employees
    
    if (result.success) {
      const normalizedEmployees = (result.data.employees || []).map(emp => ({
        ...emp,
        id: emp.id || emp._id,
      }))
      setEmployees(normalizedEmployees.filter(emp => !emp.isTerminated))
    } else {
      showError(result.error || 'Xodimlarni yuklashda xatolik')
    }
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      days.push({
        date: date,
        dateStr: dateStr,
      })
    }
    return days
  }

  const getAttendanceStatus = (employeeId, dateStr) => {
    const attendance = attendances.find(att => {
      const attDate = new Date(att.date).toISOString().split('T')[0]
      return att.employeeId === employeeId && attDate === dateStr
    })
    return attendance
  }

  const getCellColor = (attendance) => {
    if (!attendance) return 'bg-white'
    
    switch (attendance.status) {
      case 'present': return 'bg-green-500'
      case 'absent': return 'bg-red-500'
      case 'late': return 'bg-yellow-500'
      case 'half_day': return 'bg-orange-500'
      case 'leave': return 'bg-blue-500'
      default: return 'bg-white'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present': return 'P'
      case 'absent': return 'A'
      case 'late': return 'L'
      case 'half_day': return 'H'
      case 'leave': return 'T'
      default: return ''
    }
  }

  const handleCellClick = (employeeId, dateStr) => {
    const attendance = getAttendanceStatus(employeeId, dateStr)
    
    if (attendance) {
      setEditingAttendance(attendance)
      setSelectedCell({ employeeId, date: dateStr })
    } else {
      setEditingAttendance(null)
      setSelectedCell({ employeeId, date: dateStr })
    }
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingAttendance(null)
    setSelectedCell(null)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (editingAttendance && editingAttendance.id) {
        // Update existing attendance - only send fields that can be updated
        const updateData = {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          status: formData.status,
          notes: formData.notes,
        }
        const result = await apiService.updateAttendance(editingAttendance.id, updateData)
        
        if (result.success) {
          showSuccess('Davomat muvaffaqiyatli yangilandi')
          setShowForm(false)
          setEditingAttendance(null)
          setSelectedCell(null)
          await fetchAttendances()
        } else {
          showError(result.error || 'Davomatni yangilashda xatolik')
        }
      } else {
        // Create new attendance - send all required fields
        const result = await apiService.createOrUpdateAttendance(formData)
        
        if (result.success) {
          showSuccess('Davomat muvaffaqiyatli yaratildi')
          setShowForm(false)
          setEditingAttendance(null)
          setSelectedCell(null)
          await fetchAttendances()
        } else {
          showError(result.error || 'Davomatni yaratishda xatolik')
        }
      }
    } catch (error) {
      console.error('Attendance submit error:', error)
      showError('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
    }
  }

  const handleDeleteClick = (attendance) => {
    setDeletingAttendance(attendance)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingAttendance) return
    
    setIsDeleting(true)
    const result = await apiService.deleteAttendance(deletingAttendance.id)
    
    if (result.success) {
      showSuccess('Davomat muvaffaqiyatli o\'chirildi')
      setShowDeleteModal(false)
      setDeletingAttendance(null)
      await fetchAttendances()
    } else {
      showError(result.error || 'O\'chirishda xatolik yuz berdi')
    }
    setIsDeleting(false)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToCurrentMonth = () => {
    setCurrentDate(new Date())
  }

  const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"]
  const currentMonthName = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()
  const daysInMonth = getDaysInMonth()

  if (loading && attendances.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Davomat Boshqaruvi
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Davomat Qo'shish
          </motion.button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-white shadow">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {currentMonthName} {currentYear}
            </h2>
            <button
              onClick={goToCurrentMonth}
              className="px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900"
            >
              Joriy oy
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Attendance Table */}
      <div className="rounded-xl shadow-lg overflow-auto bg-white/80 border border-gray-200/50">
        <div className="min-w-full">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 sticky left-0 z-20 bg-gray-100">
                  Xodim
                </th>
                {daysInMonth.map((day, index) => (
                  <th
                    key={index}
                    className={`border border-gray-300 px-2 py-3 text-center text-sm font-semibold text-gray-700 ${
                      day.date.getDay() === 0 || day.date.getDay() === 6
                        ? 'bg-gray-100/50'
                        : ''
                    }`}
                  >
                    {day.date.getDate()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t border-gray-300">
                  <td className="border border-gray-300 px-4 py-3 text-sm sticky left-0 z-10 bg-white text-gray-900">
                    {employee.firstName} {employee.lastName} {employee.middleName}
                  </td>
                  {daysInMonth.map((day, dayIndex) => {
                    const attendance = getAttendanceStatus(employee.id, day.dateStr)

                    return (
                      <td
                        key={dayIndex}
                        className={`border border-gray-300 px-2 py-3 text-center cursor-pointer ${getCellColor(attendance)} ${
                          day.date.getDay() === 0 || day.date.getDay() === 6
                            ? 'bg-opacity-50'
                            : ''
                        }`}
                        onClick={() => handleCellClick(employee.id, day.dateStr)}
                      >
                        <span className="text-xs text-white font-semibold">
                          {attendance ? getStatusLabel(attendance.status) : ''}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 p-4 rounded-lg bg-white shadow">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
          <span className="text-sm text-gray-700">Ishda</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
          <span className="text-sm text-gray-700">Yo'q</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 mr-2 rounded"></div>
          <span className="text-sm text-gray-700">Kech kelgan</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 mr-2 rounded"></div>
          <span className="text-sm text-gray-700">Yarim kun</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
          <span className="text-sm text-gray-700">Ta'til</span>
        </div>
      </div>

      {/* Attendance Form Modal */}
      {showForm && (
        <AttendanceForm
          show={showForm}
          onClose={() => {
            setShowForm(false)
            setEditingAttendance(null)
            setSelectedCell(null)
          }}
          onSubmit={handleFormSubmit}
          attendance={editingAttendance}
          selectedCell={selectedCell}
          employees={employees}
          onDelete={editingAttendance ? () => handleDeleteClick(editingAttendance) : null}
        />
      )}

      {/* Delete Modal */}
      <DeleteAttendanceModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingAttendance(null)
        }}
        onConfirm={handleDelete}
        attendance={deletingAttendance}
        loading={isDeleting}
      />
    </div>
  )
}

export default Attendance

