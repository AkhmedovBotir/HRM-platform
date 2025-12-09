import { motion, AnimatePresence } from 'framer-motion'

function DeleteVacancyModal({ show, onClose, onConfirm, vacancyTitle, loading }) {
  if (!show) return null

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.455 19h13.09c1.054 0 1.91-.816 1.995-1.87l.455-6.505A2 2 0 0019.003 8H4.997a2 2 0 00-1.992 2.625l.455 6.505A2 2 0 005.455 19zM9 5h6m-3-2v2" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-center text-gray-900 mb-2">Vakansiyani o'chirish</h3>
          <p className="text-center text-gray-600 mb-6">
            {vacancyTitle ? (
              <>
                <span className="font-semibold text-gray-900">{vacancyTitle}</span> vakansiyasini o'chirmoqchimisiz?
              </>
            ) : (
              "Ushbu vakansiyani o'chirmoqchimisiz?"
            )}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Bekor qilish
            </button>
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg shadow-red-500/30 disabled:opacity-60"
            >
              {loading ? "O'chirilmoqda..." : "Ha, o'chirish"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DeleteVacancyModal

