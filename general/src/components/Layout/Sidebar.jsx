import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  DashboardIcon,
  CompaniesIcon,
  MessagesIcon,
  HelpIcon,
  FAQIcon,
  QuestionsIcon,
  DocumentationIcon,
  LogoutIcon,
} from '../Icons'

function Sidebar({ isCollapsed, onToggle }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [helpOpen, setHelpOpen] = useState(false)

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/companies', label: 'Kompaniyalar', icon: CompaniesIcon },
    { path: '/messages', label: 'Habarlar', icon: MessagesIcon },
  ]

  const helpItems = [
    { path: '/help/faq', label: 'FAQ', icon: FAQIcon },
    { path: '/help/questions', label: 'Savollar', icon: QuestionsIcon },
    { path: '/help/documentation', label: 'Dokumentatsiya', icon: DocumentationIcon },
  ]

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? '80px' : '280px',
      }}
      className="bg-slate-50 border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col shadow-lg transition-all duration-300 z-50"
    >
      {/* Header */}
      <div className={`px-6 py-5 border-b border-slate-200 bg-white ${isCollapsed ? 'flex justify-center' : 'flex items-center justify-between'}`}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">{user?.username || 'Admin'}</p>
            </div>
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: active }) =>
                `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  active
                    ? 'bg-white text-blue-700 shadow-md border border-blue-100'
                    : 'text-slate-700 hover:bg-white hover:shadow-sm'
                }`
              }
            >
              {({ isActive: active }) => (
                <>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : ''}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      active ? 'bg-blue-500 text-white shadow-sm' : 'bg-white text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`font-medium text-sm ${active ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.div>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-6 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
          />
        )}

        {/* Help Accordion */}
        <div className="mt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !isCollapsed && setHelpOpen(!helpOpen)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-white hover:shadow-sm transition-colors`}
            title={isCollapsed ? 'Help' : ''}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white text-slate-600 shadow-sm">
                <HelpIcon className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm"
                >
                  Help
                </motion.span>
              )}
            </div>
            {!isCollapsed && (
              <motion.svg
                animate={{ rotate: helpOpen ? 180 : 0 }}
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            )}
          </motion.button>

          <AnimatePresence>
            {helpOpen && !isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-1"
              >
                <div className="space-y-1 pl-4">
                  {helpItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive: active }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                          active
                            ? 'bg-white text-blue-700 shadow-sm border border-blue-100'
                            : 'text-slate-600 hover:bg-white hover:shadow-sm'
                        }`
                      }
                    >
                      {({ isActive: active }) => (
                        <>
                          <item.icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <LogoutIcon className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium text-sm"
            >
              Logout
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Sidebar

