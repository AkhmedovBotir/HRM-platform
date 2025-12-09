import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../services/api'
import CompanyList from '../components/Companies/CompanyList'
import CompanyForm from '../components/Companies/CompanyForm'
import CompanyModal from '../components/Companies/CompanyModal'
import DeleteConfirmationModal from '../components/Companies/DeleteConfirmationModal'
import { CompaniesIcon } from '../components/Icons'

function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [viewCompany, setViewCompany] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, company: null, loading: false })

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setLoading(true)
    setError('')
    const result = await apiService.getCompanies()
    if (result.success) {
      setCompanies(result.data.companies || [])
    } else {
      setError(result.error || 'Kompaniyalarni yuklashda xatolik')
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setSelectedCompany(null)
    setShowForm(true)
  }

  const handleEdit = (company) => {
    setSelectedCompany(company)
    setShowForm(true)
  }

  const handleView = (company) => {
    setViewCompany(company)
  }

  const handleDeleteClick = (company) => {
    setDeleteModal({ isOpen: true, company, loading: false })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.company) return

    setDeleteModal((prev) => ({ ...prev, loading: true }))
    const result = await apiService.deleteCompany(deleteModal.company.id || deleteModal.company._id)
    
    if (result.success) {
      setDeleteModal({ isOpen: false, company: null, loading: false })
      fetchCompanies()
    } else {
      alert(result.error || 'Kompaniyani o\'chirishda xatolik')
      setDeleteModal((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleSave = async (formData) => {
    setFormLoading(true)
    setError('')

    let result
    if (selectedCompany) {
      result = await apiService.updateCompany(selectedCompany.id || selectedCompany._id, formData)
    } else {
      result = await apiService.createCompany(formData)
    }

    if (result.success) {
      setShowForm(false)
      setSelectedCompany(null)
      fetchCompanies()
    } else {
      setError(result.error || 'Saqlashda xatolik')
    }

    setFormLoading(false)
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedCompany(null)
    setError('')
  }

  const handleStatusChange = async (company, newStatus) => {
    const companyId = company.id || company._id
    setFormLoading(true)
    setError('')
    
    const result = await apiService.updateCompanyStatus(companyId, newStatus)
    
    if (result.success) {
      fetchCompanies()
      if (viewCompany && (viewCompany.id === companyId || viewCompany._id === companyId)) {
        setViewCompany(result.data.company)
      }
    } else {
      setError(result.error || 'Statusni yangilashda xatolik')
      alert(result.error || 'Statusni yangilashda xatolik')
    }
    
    setFormLoading(false)
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <CompaniesIcon className="w-5 h-5 text-white" />
              </div>
              Kompaniyalar
            </h1>
            <p className="text-gray-600">
              Barcha kompaniyalar ro'yxati ({companies.length})
            </p>
          </div>
          <motion.button
            onClick={handleCreate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yangi kompaniya
          </motion.button>
        </div>
      </motion.div>

      {error && !showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedCompany ? 'Kompaniyani tahrirlash' : 'Yangi kompaniya yaratish'}
            </h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <CompanyForm
              company={selectedCompany}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </motion.div>
        ) : (
          <CompanyList
            companies={companies}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        )}
      </AnimatePresence>

      <CompanyModal
        company={viewCompany}
        isOpen={!!viewCompany}
        onClose={() => setViewCompany(null)}
        onEdit={(company) => {
          setViewCompany(null)
          handleEdit(company)
        }}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, company: null, loading: false })}
        onConfirm={handleDeleteConfirm}
        companyName={deleteModal.company?.nom || ''}
        loading={deleteModal.loading}
      />
    </div>
  )
}

export default Companies

