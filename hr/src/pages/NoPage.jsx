import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function NoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Sahifa topilmadi</h2>
          <p className="text-lg text-gray-600 mb-8">
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
          >
            Bosh sahifaga qaytish
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105"
          >
            Orqaga qaytish
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/employees" className="text-gray-500 hover:text-blue-600 transition-colors">
              Xodimlar
            </Link>
            <Link to="/vacancies" className="text-gray-500 hover:text-blue-600 transition-colors">
              Vakansiyalar
            </Link>
            <Link to="/departments" className="text-gray-500 hover:text-blue-600 transition-colors">
              Bo'limlar
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NoPage





