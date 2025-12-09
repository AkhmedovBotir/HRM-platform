import { motion } from 'framer-motion'

function ScheduleTemplateCard({ template, onEdit, onDeleteClick, onStatusChange }) {
  const handleStatusChange = async () => {
    const newStatus = template.status === 'active' ? 'inactive' : 'active'
    const templateId = template.id || template._id
    await onStatusChange(templateId, newStatus)
  }

  const handleDeleteClick = () => {
    const templateId = template.id || template._id
    onDeleteClick(templateId, template.nom)
  }

  const getWorkingDays = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    return days.filter(day => template[day]?.isWorking).length
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
            template.status === 'active' 
              ? 'bg-gradient-to-br from-indigo-400 to-indigo-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-600'
          }`}>
            {template.nom.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{template.nom}</h3>
            <p className="text-sm text-gray-500">{getWorkingDays()} kun ish</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          template.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {template.status === 'active' ? 'Faol' : 'Nofaol'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
          const dayData = template[day]
          const dayNames = {
            monday: 'Dushanba',
            tuesday: 'Seshanba',
            wednesday: 'Chorshanba',
            thursday: 'Payshanba',
            friday: 'Juma',
            saturday: 'Shanba',
            sunday: 'Yakshanba'
          }
          if (!dayData?.isWorking) return null
          return (
            <div key={day} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-20 text-xs">{dayNames[day]}:</span>
              <span>{dayData.startTime} - {dayData.endTime}</span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(template)}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
        >
          Tahrirlash
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStatusChange}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            template.status === 'active'
              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {template.status === 'active' ? 'Nofaol' : 'Faol'}
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

export default ScheduleTemplateCard






