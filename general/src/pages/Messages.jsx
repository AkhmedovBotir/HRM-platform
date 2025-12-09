import { motion } from 'framer-motion'

function Messages() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Habarlar
        </h1>
        <p className="text-gray-600">
          Barcha xabarlar ro'yxati
        </p>
      </motion.div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Xabar {item}
            </h3>
            <p className="text-gray-600">
              Xabar matni va ma'lumotlari
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Messages

