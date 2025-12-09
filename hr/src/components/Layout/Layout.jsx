import { useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 transition-all duration-300 bg-white"
        style={{ marginLeft: isCollapsed ? '80px' : '280px' }}
      >
        <div className="min-h-screen">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}

export default Layout

