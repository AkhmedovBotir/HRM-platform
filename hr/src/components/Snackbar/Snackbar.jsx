import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useSnackbar } from '../../contexts/SnackbarContext'

function Snackbar() {
  const { snackbar, hideSnackbar } = useSnackbar()

  useEffect(() => {
    if (snackbar.show && snackbar.autoHide !== false) {
      const timer = setTimeout(() => {
        hideSnackbar()
      }, snackbar.duration || 4000)

      return () => clearTimeout(timer)
    }
  }, [snackbar.show, snackbar.duration, snackbar.autoHide, hideSnackbar])

  const getIcon = () => {
    switch (snackbar.type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getColors = () => {
    switch (snackbar.type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
        }
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
        }
    }
  }

  const colors = getColors()

  return (
    <AnimatePresence>
      {snackbar.show && (
        <div className="fixed top-4 right-4 z-[10000] max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: -50, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: 100 }}
            className={`${colors.bg} ${colors.border} border rounded-lg shadow-lg p-4 flex items-start gap-3`}
          >
            <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${colors.text} font-medium text-sm`}>
                {snackbar.message}
              </p>
            </div>
            <button
              onClick={hideSnackbar}
              className={`${colors.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Snackbar



