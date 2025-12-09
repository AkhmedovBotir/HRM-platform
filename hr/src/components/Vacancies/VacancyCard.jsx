import { motion } from 'framer-motion'

function VacancyCard({ vacancy, onEdit, onDelete, onStatusChange, onView, onApplicationClick, onApplicationFormClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const statusStyles = {
    active: 'bg-green-100 text-green-700',
    close: 'bg-gray-100 text-gray-600',
  }

  const typeLabel = {
    fulltime: "To'liq stavka",
    parttime: 'Yarim stavka',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{vacancy.nom}</h3>
          <p className="text-sm text-gray-500">
            {vacancy.departmentName || "Bo'lim aniqlanmagan"} • {vacancy.positionName || 'Lavozim aniqlanmagan'}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[vacancy.status] || 'bg-gray-100 text-gray-600'}`}>
          {vacancy.status === 'active' ? 'Faol' : 'Yopiq'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Daraja</span>
          <span className="font-medium text-gray-900">{vacancy.daraja || '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Ish turi</span>
          <span className="font-medium text-gray-900">{typeLabel[vacancy.type] || vacancy.type || '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Oylik</span>
          <span className="font-medium text-gray-900">{vacancy.oylik || 'Kelishiladi'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Arizalar</span>
          <button
            onClick={() => onApplicationClick?.(vacancy)}
            className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700"
          >
            {vacancy.applicationCount ?? 0} ta
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {vacancy.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {vacancy.skills.map((skill) => (
            <span key={skill} className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-medium">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        <button
          onClick={() => onView?.(vacancy)}
          className="flex-1 min-w-[120px] px-4 py-2 text-sm font-medium text-gray-700 border border-gray-600 rounded-lg hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          Ko'rish
        </button>
        <button
          onClick={() => onEdit?.(vacancy)}
          className="flex-1 min-w-[120px] px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
        >
          Tahrirlash
        </button>
        <button
          onClick={() => onApplicationFormClick?.(vacancy)}
          className="flex-1 min-w-[120px] px-4 py-2 text-sm font-medium text-green-600 border border-gradient-to-r from-green-600 to-green-100 rounded-lg hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
        >
          So'rovnoma
        </button>
        <button
          onClick={() => onStatusChange?.(vacancy, vacancy.status === 'active' ? 'close' : 'active')}
          className="flex-1 min-w-[120px] px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-500 hover:text-white transition-colors cursor-pointer"
        >
          {vacancy.status === 'active' ? 'Yopish' : 'Faollashtirish'}
        </button>
        <button
          onClick={() => onDelete?.(vacancy)}
          className="flex-1 min-w-[120px] px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
        >
          O'chirish
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
        <span>Yaratildi: {formatDate(vacancy.createdAt)}</span>
        <span>Yangilandi: {formatDate(vacancy.updatedAt)}</span>
      </div>
    </motion.div>
  )
}

export default VacancyCard

