import { motion, AnimatePresence } from 'framer-motion'

function VacancyDetailModal({ vacancy, onClose, onEdit, onStatusChange, onApplicationClick }) {
  if (!vacancy) return null

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const getTypeLabel = (type) => {
    if (type === 'fulltime') return "To'liq stavka"
    if (type === 'parttime') return 'Yarim stavka'
    return type || '—'
  }

  const statusLabel = vacancy.status === 'active' ? 'Faol' : 'Yopiq'
  const statusStyles = vacancy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'

  const detailBlocks = [
    { label: "Bo'lim", value: vacancy.departmentName || vacancy.departmentId?.nom || '—' },
    { label: 'Lavozim', value: vacancy.positionName || vacancy.positionId?.nom || '—' },
    { label: 'Ish grafigi', value: vacancy.workScheduleName || vacancy.workScheduleId?.nom || '—' },
    { label: 'Daraja', value: vacancy.daraja || '—' },
    { label: 'Ish turi', value: getTypeLabel(vacancy.type) },
    { label: 'Oylik', value: vacancy.oylik || 'Kelishiladi' },
    { label: 'Arizalar', value: `${vacancy.applicationCount ?? 0} ta`, withAction: true },
    { label: 'Yosh chegarasi', value: vacancy.minAge && vacancy.maxAge ? `${vacancy.minAge} - ${vacancy.maxAge} yosh` : vacancy.minAge ? `Minimal ${vacancy.minAge} yosh` : vacancy.maxAge ? `Maksimal ${vacancy.maxAge} yosh` : '—' },
    { label: 'Yaratilgan sana', value: formatDate(vacancy.createdAt) },
    { label: 'Yangilangan sana', value: formatDate(vacancy.updatedAt) },
  ]

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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto"
        >
          <div className="px-10 py-8 border-b border-gray-100 flex flex-wrap items-center gap-4 justify-between">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">Vakansiya</p>
              <h2 className="text-3xl font-bold text-gray-900">{vacancy.nom}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusStyles}`}>
                {statusLabel}
              </span>
              <button
                onClick={() => onStatusChange?.(vacancy, vacancy.status === 'active' ? 'close' : 'active')}
                className="px-4 py-2 rounded-xl border border-purple-100 text-purple-600 font-medium hover:bg-purple-50 transition-colors"
              >
                {vacancy.status === 'active' ? 'Yopish' : 'Faollashtirish'}
              </button>
              <button
                onClick={() => onEdit?.(vacancy)}
                className="px-4 py-2 rounded-xl border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                Tahrirlash
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-10 py-6 space-y-8">
            {/* Asosiy ma'lumotlar bloki */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {detailBlocks.map((block) => (
                <div key={block.label} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{block.label}</p>
                  {block.withAction ? (
                    <button
                      onClick={() => onApplicationClick?.(vacancy)}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2"
                    >
                      {block.value}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{block.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Ko'nikmalar bloki */}
            {vacancy.skills?.length > 0 && (
              <div className="p-6 border border-gray-100 rounded-2xl bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ko'nikmalar</h3>
                <div className="flex flex-wrap gap-2">
                  {vacancy.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tavsif va Majburiyatlar bloki */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-100 rounded-2xl bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vakansiya tavsifi</h3>
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: vacancy.description || "<p class='text-gray-400'>Ma'lumot mavjud emas</p>" }}
                />
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Majburiyatlar</h3>
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: vacancy.responsibilities || "<p class='text-gray-400'>Ma'lumot mavjud emas</p>" }}
                />
              </div>
            </div>

            {/* Afzal ko'riladigan talablar bloki */}
            <div className="p-6 border border-gray-100 rounded-2xl bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Afzal ko'riladigan talablar</h3>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: vacancy.preferences || "<p class='text-gray-400'>Ma'lumot mavjud emas</p>" }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default VacancyDetailModal

