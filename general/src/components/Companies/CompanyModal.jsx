import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CompaniesIcon } from '../Icons'
import DeleteConfirmationModal from './DeleteConfirmationModal'

function CompanyModal({ company, isOpen, onClose, onEdit, onDelete, onStatusChange }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  if (!isOpen || !company) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <CompaniesIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Kompaniya ma'lumotlari</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Kompaniya nomi</label>
                    <p className="text-gray-900 font-medium">{company.nom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">INN</label>
                    <p className="text-gray-900 font-medium">{company.INN}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Kompaniya egasi</label>
                    <p className="text-gray-900 font-medium">{company.kompaniyaEgasi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Ega telefon raqami</label>
                    <p className="text-gray-900 font-medium">{company.kompaniyaEgasiTelefon}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Kompaniya telefon raqami</label>
                    <p className="text-gray-900 font-medium">{company.kompaniyaTelefon}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                    <p className="text-blue-600 font-medium">{company.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          company.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {company.status === 'active' ? 'Faol' : 'Nofaol'}
                      </span>
                      {onStatusChange && (
                        <motion.button
                          onClick={() => {
                            const newStatus = company.status === 'active' ? 'inactive' : 'active'
                            onStatusChange(company, newStatus)
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          {company.status === 'active' ? "Nofaol qilish" : "Faol qilish"}
                        </motion.button>
                      )}
                    </div>
                  </div>
                  {company.createdAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Yaratilgan sana</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(company.createdAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  )}
                  {company.updatedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Yangilangan sana</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(company.updatedAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
                >
                  Yopish
                </motion.button>
                <motion.button
                  onClick={() => {
                    onEdit(company)
                    onClose()
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tahrirlash
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  O'chirish
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(company)
          setShowDeleteModal(false)
          onClose()
        }}
        companyName={company?.nom || ''}
        loading={false}
      />
    </AnimatePresence>
  )
}

export default CompanyModal

