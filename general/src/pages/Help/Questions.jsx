import { motion } from 'framer-motion'

function Questions() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Savollar
        </h1>
        <p className="text-gray-600">
          Barcha savollar ro'yxati
        </p>
      </motion.div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Savol {item}
            </h3>
            <p className="text-gray-600">
              Savol matni va javoblar
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Questions

