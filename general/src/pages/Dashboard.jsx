import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Xush kelibsiz, {user?.username || 'Admin'}!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Card {item}
            </h3>
            <p className="text-gray-600">
              Bu yerda kontent bo'ladi
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard

