import { motion } from 'framer-motion'

function Documentation() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dokumentatsiya
        </h1>
        <p className="text-gray-600">
          Loyiha dokumentatsiyasi
        </p>
      </motion.div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose max-w-none"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Kirish
          </h2>
          <p className="text-gray-600 mb-4">
            Bu yerda loyiha haqida batafsil ma'lumot bo'ladi.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Qo'llanma
          </h2>
          <p className="text-gray-600">
            Qo'llanma matni va ko'rsatmalar.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Documentation

