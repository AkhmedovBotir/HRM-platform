import { motion, AnimatePresence } from 'framer-motion'

function ReferralDetailModal({ referral, onClose }) {
  if (!referral) return null

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'reviewed':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'accepted':
        return 'Tasdiqlangan'
      case 'rejected':
        return 'Rad etilgan'
      case 'pending':
        return 'Kutilmoqda'
      case 'reviewed':
        return 'Ko\'rib chiqilgan'
      default:
        return status
    }
  }

  const getCandidateName = () => {
    if (!referral.answers || referral.answers.length === 0) return 'Noma\'lum nomzod'
    
    const nameAnswer = referral.answers.find(
      (ans) => ans.question && (ans.question.toLowerCase().includes('ism') || ans.question.toLowerCase().includes('familiya') || ans.question.toLowerCase().includes('f.i.o'))
    )
    
    if (nameAnswer) {
      return nameAnswer.answer || 'Noma\'lum nomzod'
    }
    
    if (referral.answers.length > 0) {
      return referral.answers[0].answer || 'Noma\'lum nomzod'
    }
    
    return 'Noma\'lum nomzod'
  }

  const isBase64Image = (str) => {
    if (typeof str !== 'string') return false
    return str.startsWith('data:image/') || (str.length > 100 && /^[A-Za-z0-9+/=]+$/.test(str.replace(/\s/g, '')))
  }

  const renderAnswer = (answer) => {
    if (Array.isArray(answer.answer)) {
      return (
        <div className="flex flex-wrap gap-2">
          {answer.answer.map((item, index) => {
            if (isBase64Image(item)) {
              return (
                <div key={index} className="inline-block">
                  <img
                    src={item.startsWith('data:') ? item : `data:image/jpeg;base64,${item}`}
                    alt={`Rasm ${index + 1}`}
                    className="max-w-32 max-h-32 rounded-lg border border-gray-200 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      const modal = document.createElement('div')
                      modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4'
                      modal.onclick = () => modal.remove()
                      const img = document.createElement('img')
                      img.src = e.target.src
                      img.className = 'max-w-full max-h-[90vh] object-contain rounded-lg'
                      modal.appendChild(img)
                      document.body.appendChild(modal)
                    }}
                  />
                </div>
              )
            }
            return (
              <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm">
                {item}
              </span>
            )
          })}
        </div>
      )
    }
    
    if (typeof answer.answer === 'string' && isBase64Image(answer.answer)) {
      const imageSrc = answer.answer.startsWith('data:') 
        ? answer.answer 
        : `data:image/jpeg;base64,${answer.answer}`
      
      return (
        <div className="mt-2">
          <img
            src={imageSrc}
            alt="Yuklangan rasm"
            className="max-w-48 max-h-48 rounded-lg border border-gray-200 object-contain cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              const modal = document.createElement('div')
              modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4'
              modal.onclick = () => modal.remove()
              const img = document.createElement('img')
              img.src = e.target.src
              img.className = 'max-w-full max-h-[90vh] object-contain rounded-lg'
              modal.appendChild(img)
              document.body.appendChild(modal)
            }}
          />
        </div>
      )
    }
    
    if (typeof answer.answer === 'string' && answer.answer.startsWith('http')) {
      return (
        <a
          href={answer.answer}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 underline break-all"
        >
          {answer.answer}
        </a>
      )
    }
    
    return <span className="text-gray-900 whitespace-pre-wrap break-words">{answer.answer || '—'}</span>
  }

  const referralEmployee = referral.referralEmployeeId

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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto"
        >
          <div className="px-10 py-8 border-b border-gray-100 flex flex-wrap items-center gap-4 justify-between sticky top-0 bg-white z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  Referal
                </span>
                <p className="text-sm uppercase tracking-wider text-gray-400">Ariza</p>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{getCandidateName()}</h2>
              <p className="text-sm text-gray-500 mt-1">{referral.vacancyId?.nom || 'Noma\'lum vakansiya'}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(referral.status)}`}>
                {getStatusLabel(referral.status)}
              </span>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-10 py-6 space-y-6">
            {/* Asosiy ma'lumotlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Vakansiya</p>
                <p className="text-lg font-semibold text-gray-900">{referral.vacancyId?.nom || '—'}</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Yuborilgan sana</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(referral.createdAt)}</p>
              </div>
            </div>

            {/* Taklif qilgan xodim */}
            {referralEmployee && (
              <div className="p-4 border border-purple-100 rounded-2xl bg-purple-50/50">
                <p className="text-xs uppercase tracking-wider text-purple-600 mb-2">Taklif qilgan xodim</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-lg">
                    {referralEmployee.firstName?.[0]}{referralEmployee.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {referralEmployee.firstName} {referralEmployee.lastName}
                      {referralEmployee.middleName && ` ${referralEmployee.middleName}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {referralEmployee.positionId?.nom || referralEmployee.departmentId?.nom || ''}
                      {referralEmployee.phone && ` • ${referralEmployee.phone}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Referal izohi */}
            {referral.referralNote && (
              <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Izoh</p>
                <p className="text-gray-700 whitespace-pre-wrap">{referral.referralNote}</p>
              </div>
            )}

            {/* Savollar va javoblar */}
            {referral.answers && referral.answers.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Savollar va javoblar</h3>
                <div className="space-y-4">
                  {referral.answers.map((answer, index) => (
                    <div key={index} className="p-4 border border-gray-100 rounded-2xl bg-white">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 mb-2">{answer.question || 'Savol'}</h4>
                          <div className="text-gray-700">
                            {renderAnswer(answer)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Savollar va javoblar mavjud emas</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ReferralDetailModal



