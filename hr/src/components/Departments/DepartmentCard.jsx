import { motion } from 'framer-motion'

function DepartmentCard({ department, onEdit, onDelete, onStatusChange, onDeleteClick }) {
  const handleStatusChange = async () => {
    const newStatus = department.status === 'active' ? 'inactive' : 'active'
    const departmentId = department.id || department._id
    await onStatusChange(departmentId, newStatus)
  }

  const handleDeleteClick = () => {
    const departmentId = department.id || department._id
    onDeleteClick(departmentId, department.nom)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
            department.status === 'active' 
              ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-600'
          }`}>
            {department.nom.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{department.nom}</h3>
            <p className="text-sm text-gray-500">Bo'lim</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          department.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {department.status === 'active' ? 'Faol' : 'Nofaol'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{(() => {
            try {
              const date = new Date(department.createdAt)
              if (isNaN(date.getTime())) return 'N/A'
              const day = String(date.getDate()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const year = date.getFullYear()
              return `${day}.${month}.${year}`
            } catch {
              return 'N/A'
            }
          })()}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(department)}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
        >
          Tahrirlash
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStatusChange}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            department.status === 'active'
              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {department.status === 'active' ? 'Nofaol' : 'Faol'}
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

export default DepartmentCard

