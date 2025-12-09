import { createContext, useContext, useState } from 'react'

const SnackbarContext = createContext(null)

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'info', // success, error, warning, info
    duration: 4000,
    autoHide: true,
  })

  const showSnackbar = (message, type = 'info', options = {}) => {
    setSnackbar({
      show: true,
      message,
      type,
      duration: options.duration || 4000,
      autoHide: options.autoHide !== false,
    })
  }

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, show: false }))
  }

  const showSuccess = (message, options) => {
    showSnackbar(message, 'success', options)
  }

  const showError = (message, options) => {
    showSnackbar(message, 'error', options)
  }

  const showWarning = (message, options) => {
    showSnackbar(message, 'warning', options)
  }

  const showInfo = (message, options) => {
    showSnackbar(message, 'info', options)
  }

  return (
    <SnackbarContext.Provider
      value={{
        snackbar,
        showSnackbar,
        hideSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider')
  }
  return context
}







