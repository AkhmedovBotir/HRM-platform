import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function UpdateApplicationCountModal({ show, vacancy, onClose, onSubmit, loading }) {
  const [count, setCount] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (vacancy) {
      setCount((vacancy.applicationCount ?? 0).toString())
      setError('')
    }
  }, [vacancy])

  if (!show) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const numericValue = Number(count)
    if (Number.isNaN(numericValue) || numericValue < 0) {
      setError("Ariza soni 0 yoki undan katta bo'lishi kerak")
      return
    }
    onSubmit(numericValue)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ariza sonini yangilash</h3>
            <p className="text-gray-600">
              {vacancy?.nom ? (
                <>
                  <span className="font-semibold">{vacancy.nom}</span> vakansiyasi uchun ariza sonini kiriting
                </>
              ) : (
                'Ariza sonini yangilang'
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arizalar soni</label>
            <input
              type="number"
              min="0"
              value={count}
              onChange={(e) => {
                setCount(e.target.value)
                setError('')
              }}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Bekor qilish
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-60"
            >
              {loading ? 'Saqlanmoqda...' : 'Yangilash'}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  )
}

export default UpdateApplicationCountModal

