import { motion } from 'framer-motion'

function EmployeeScheduleCard({ schedule, onEdit, onDeleteClick, onStatusChange }) {
  const handleStatusChange = async () => {
    const newStatus = schedule.status === 'active' ? 'inactive' : 'active'
    const scheduleId = schedule.id || schedule._id
    await onStatusChange(scheduleId, newStatus)
  }

  const handleDeleteClick = () => {
    const scheduleId = schedule.id || schedule._id
    const displayName = `${schedule.employeeName || 'Xodim'} - ${schedule.templateName || 'Shablon'}`
    onDeleteClick(scheduleId, displayName)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Cheksiz'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    } catch {
      return 'N/A'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
            schedule.status === 'active' 
              ? 'bg-gradient-to-br from-green-400 to-green-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-600'
          }`}>
            {schedule.employeeName?.charAt(0).toUpperCase() || 'X'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{schedule.employeeName || 'N/A'}</h3>
            <p className="text-sm text-gray-500">{schedule.templateName || 'Shablon topilmadi'}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          schedule.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {schedule.status === 'active' ? 'Faol' : 'Nofaol'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Boshlanish: {formatDate(schedule.startDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Tugash: {formatDate(schedule.endDate)}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(schedule)}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
        >
          Tahrirlash
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStatusChange}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            schedule.status === 'active'
              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {schedule.status === 'active' ? 'Nofaol' : 'Faol'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDeleteClick}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
        >
          O'chirish
        </motion.button>
      </div>
    </motion.div>
  )
}

export default EmployeeScheduleCard






