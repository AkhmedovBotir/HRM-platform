import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SearchableSelect({
  label,
  value,
  onChange,
  options = [],
  getOptionLabel = (option) => option.nom || option.name || option.label || '',
  getOptionValue = (option) => option.id || option._id || option.value || '',
  placeholder = 'Tanlang...',
  searchPlaceholder = 'Qidirish...',
  loading = false,
  error,
  required = false,
  className = '',
  zIndex = 10001,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedOptions, setDisplayedOptions] = useState(options)
  const [currentPage, setCurrentPage] = useState(1)
  const [dropdownStyle, setDropdownStyle] = useState({})
  const itemsPerPage = 10
  const selectRef = useRef(null)
  const searchInputRef = useRef(null)

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setDisplayedOptions(options)
    } else {
      const filtered = options.filter((option) => {
        const label = getOptionLabel(option).toLowerCase()
        return label.includes(searchTerm.toLowerCase())
      })
      setDisplayedOptions(filtered)
    }
    setCurrentPage(1)
  }, [searchTerm, options, getOptionLabel])

  // Pagination
  const totalPages = Math.ceil(displayedOptions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOptions = displayedOptions.slice(startIndex, endIndex)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Focus search input when dropdown opens and update position
  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect()
      setDropdownStyle({
        width: rect.width,
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      })
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSelect = (option) => {
    const optionValue = getOptionValue(option)
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const selectedOption = options.find(
    (opt) => getOptionValue(opt) === value
  )

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
        disabled={loading}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 flex flex-col`}
            style={{ ...dropdownStyle, zIndex: zIndex }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Options List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Yuklanmoqda...</p>
                </div>
              ) : paginatedOptions.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'Natija topilmadi' : 'Ma\'lumot yo\'q'}
                </div>
              ) : (
                <ul className="py-1">
                  {paginatedOptions.map((option) => {
                    const optionValue = getOptionValue(option)
                    const optionLabel = getOptionLabel(option)
                    const isSelected = value === optionValue

                    return (
                      <li key={optionValue}>
                        <button
                          type="button"
                          onClick={() => handleSelect(option)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                            isSelected ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-900'
                          }`}
                        >
                          {optionLabel}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-2 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Oldingi
                </button>
                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keyingi
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchableSelect

