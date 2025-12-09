import { motion, AnimatePresence } from 'framer-motion'

function EmployeeDetailModal({ show, onClose, employee, onEdit, onTerminate, onCredentials }) {
  if (!show || !employee) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    } catch (error) {
      return 'N/A'
    }
  }

  const formatGender = (gender) => {
    return gender === 'male' ? 'Erkak' : 'Ayol'
  }

  return (
    <AnimatePresence>
      {show && (
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Xodim ma'lumotlari
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-br from-indigo-400 to-indigo-600">
                  {employee.firstName?.charAt(0).toUpperCase()}
                  {employee.lastName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {employee.firstName} {employee.lastName} {employee.middleName}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {employee.positionName || employee.positionId?.nom || 'Lavozim topilmadi'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {employee.departmentName || employee.departmentId?.nom || 'Bo\'lim topilmadi'}
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Shaxsiy ma'lumotlar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Tug'ilgan sana</p>
                    <p className="font-medium text-gray-900">{formatDate(employee.birthDate)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Jinsi</p>
                    <p className="font-medium text-gray-900">{formatGender(employee.gender)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Telefon raqami</p>
                    <p className="font-medium text-gray-900">{employee.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Pasport seriya va raqami</p>
                    <p className="font-medium text-gray-900">{employee.passport}</p>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ish haqida ma'lumot</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Ishga kirgan sana</p>
                    <p className="font-medium text-gray-900">{formatDate(employee.hireDate)}</p>
                  </div>
                  {employee.isTerminated && employee.terminationDate && (
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Ishdan bo'shatilgan sana</p>
                      <p className="font-medium text-orange-900">{formatDate(employee.terminationDate)}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Bo'lim</p>
                    <p className="font-medium text-gray-900">
                      {employee.departmentName || employee.departmentId?.nom || 'Bo\'lim topilmadi'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Lavozim</p>
                    <p className="font-medium text-gray-900">
                      {employee.positionName || employee.positionId?.nom || 'Lavozim topilmadi'}
                    </p>
                  </div>
                </div>
                {employee.isTerminated && employee.terminationReason && (
                  <div className="mt-4 bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Ishdan bo'shatish sababi</p>
                    <p className="font-medium text-orange-900">{employee.terminationReason}</p>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Manzil</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{employee.address}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Yopish
                </motion.button>
                {!employee.isTerminated && (
                  <>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onEdit(employee)
                        onClose()
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                    >
                      Tahrirlash
                    </motion.button>
                    {onCredentials && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onCredentials(employee)
                          onClose()
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Login
                      </motion.button>
                    )}
                    {onTerminate && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onTerminate(employee)
                          onClose()
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      >
                        Ishdan bo'shatish
                      </motion.button>
                    )}
                  </>
                )}
                {employee.isTerminated && (
                  <div className="flex-1 px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-medium text-center">
                    Ishdan bo'shatilgan
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EmployeeDetailModal

