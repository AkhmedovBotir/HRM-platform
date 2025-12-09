import { motion } from 'framer-motion'
import EmployeeScheduleCard from './EmployeeScheduleCard'

function EmployeeScheduleList({ schedules, onEdit, onDeleteClick, onStatusChange, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!schedules || schedules.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-lg shadow-sm"
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Grafiklar topilmadi</h3>
        <p className="mt-1 text-sm text-gray-500">Yangi grafik qo'shish uchun "Yangi grafik" tugmasini bosing.</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((schedule, index) => (
        <motion.div
          key={schedule.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <EmployeeScheduleCard
            schedule={schedule}
            onEdit={onEdit}
            onDeleteClick={onDeleteClick}
            onStatusChange={onStatusChange}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default EmployeeScheduleList






