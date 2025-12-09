import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../../services/api'
import { useSnackbar } from '../../contexts/SnackbarContext'

function EmployeeCredentialsModal({ show, onClose, employee }) {
  const [mode, setMode] = useState('create') // 'create', 'update', 'reset'
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const { showError, showSuccess } = useSnackbar()

  if (!show || !employee) return null

  const employeeId = employee.id || employee._id
  const fullName = `${employee.firstName} ${employee.lastName}`

  const handleCreateCredentials = async () => {
    setLoading(true)
    const data = { employeeId }
    if (formData.username) data.username = formData.username
    if (formData.password) data.password = formData.password

    const result = await apiService.createEmployeeCredentials(data)

    if (result.success) {
      setCredentials(result.data.credentials)
      showSuccess('Login ma\'lumotlari muvaffaqiyatli yaratildi')
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const handleUpdateCredentials = async () => {
    if (!formData.username && !formData.password) {
      showError('Kamida bitta maydon to\'ldirilishi kerak')
      return
    }
    setLoading(true)
    const data = { employeeId }
    if (formData.username) data.username = formData.username
    if (formData.password) data.password = formData.password

    const result = await apiService.updateEmployeeCredentials(data)

    if (result.success) {
      setCredentials(result.data.credentials)
      showSuccess('Login ma\'lumotlari muvaffaqiyatli yangilandi')
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const handleResetPassword = async () => {
    setLoading(true)
    const data = { employeeId }
    if (formData.password) data.newPassword = formData.password

    const result = await apiService.resetEmployeePassword(data)

    if (result.success) {
      setCredentials(result.data.credentials)
      showSuccess('Parol muvaffaqiyatli tiklandi')
    } else {
      showError(result.error)
    }
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === 'create') {
      handleCreateCredentials()
    } else if (mode === 'update') {
      handleUpdateCredentials()
    } else if (mode === 'reset') {
      handleResetPassword()
    }
  }

  const handleClose = () => {
    setCredentials(null)
    setFormData({ username: '', password: '' })
    setMode('create')
    onClose()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    showSuccess('Nusxalandi!')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Xodim Login Ma'lumotlari</h2>
            <p className="text-blue-100 text-sm mt-1">{fullName}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {credentials ? (
              /* Show credentials */
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="text-green-800 font-semibold mb-3">Login ma'lumotlari</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                      <div>
                        <span className="text-xs text-gray-500">Username</span>
                        <p className="font-mono font-semibold text-gray-800">{credentials.username}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(credentials.username)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Nusxalash"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                      <div>
                        <span className="text-xs text-gray-500">Parol</span>
                        <p className="font-mono font-semibold text-gray-800">{credentials.password}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(credentials.password)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Nusxalash"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-amber-600 mt-3 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Bu ma'lumotlarni xavfsiz joyda saqlang. Parol qayta ko'rsatilmaydi!
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Yopish
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mode tabs */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMode('create')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'create'
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Yaratish
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('update')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'update'
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Yangilash
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'reset'
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Tiklash
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500">
                  {mode === 'create' && 'Xodim uchun yangi login ma\'lumotlarini yarating. Bo\'sh qoldirilsa avtomatik yaratiladi.'}
                  {mode === 'update' && 'Mavjud login ma\'lumotlarini yangilang.'}
                  {mode === 'reset' && 'Xodim parolini tiklang. Bo\'sh qoldirilsa avtomatik yaratiladi.'}
                </p>

                {/* Username field (not for reset) */}
                {mode !== 'reset' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username {mode === 'create' && <span className="text-gray-400">(ixtiyoriy)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="masalan: sardor.karimov"
                    />
                  </div>
                )}

                {/* Password field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parol <span className="text-gray-400">(ixtiyoriy)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Kamida 6 ta belgi"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {mode === 'create' && 'Yaratish'}
                    {mode === 'update' && 'Yangilash'}
                    {mode === 'reset' && 'Tiklash'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EmployeeCredentialsModal

