import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import AdminList from '../components/Admins/AdminList'
import AdminForm from '../components/Admins/AdminForm'
import DeleteAdminModal from '../components/Admins/DeleteAdminModal'

function Admins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAdmin, setDeletingAdmin] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setLoading(true)
    const result = await apiService.getAdmins()
    
    if (result.success) {
      // Normalize admin data - convert _id to id if needed
      const normalizedAdmins = (result.data.admins || []).map(admin => ({
        ...admin,
        id: admin.id || admin._id,
      }))
      setAdmins(normalizedAdmins)
    } else {
      showError(result.error || 'Adminlarni yuklashda xatolik yuz berdi')
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingAdmin(null)
    setShowForm(true)
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    setFormLoading(true)

    let result
    if (editingAdmin) {
      const adminId = editingAdmin.id || editingAdmin._id
      result = await apiService.updateAdmin(adminId, formData)
    } else {
      result = await apiService.createAdmin(formData)
    }

    if (result.success) {
      setShowForm(false)
      setEditingAdmin(null)
      showSuccess(editingAdmin ? 'Admin muvaffaqiyatli yangilandi' : 'Admin muvaffaqiyatli yaratildi')
      await fetchAdmins()
    } else {
      showError(result.error || 'Xatolik yuz berdi')
    }
    setFormLoading(false)
  }

  const handleDeleteClick = (id, name) => {
    setDeletingAdmin({ id, name })
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingAdmin) return
    
    setIsDeleting(true)
    const result = await apiService.deleteAdmin(deletingAdmin.id)
    
    if (result.success) {
      showSuccess('Admin muvaffaqiyatli o\'chirildi')
      setShowDeleteModal(false)
      setDeletingAdmin(null)
      await fetchAdmins()
    } else {
      showError(result.error || 'O\'chirishda xatolik yuz berdi')
    }
    setIsDeleting(false)
  }

  const handleStatusChange = async (id, status) => {
    const result = await apiService.updateAdminStatus(id, status)
    
    if (result.success) {
      const statusText = status === 'active' ? 'faol' : 'nofaol'
      showSuccess(`Admin statusi "${statusText}" ga o'zgartirildi`)
      await fetchAdmins()
    } else {
      showError(result.error || 'Statusni o\'zgartirishda xatolik yuz berdi')
    }
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Kompaniya Adminlari
            </h1>
            <p className="text-gray-600">
              Kompaniya adminlarini Boshqarish
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yangi admin
          </motion.button>
        </div>
      </motion.div>

      <AdminList
        admins={admins}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        onStatusChange={handleStatusChange}
        loading={loading}
      />

      {showForm && (
        <AdminForm
          admin={editingAdmin}
          onClose={() => {
            setShowForm(false)
            setEditingAdmin(null)
          }}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      )}

      <DeleteAdminModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingAdmin(null)
        }}
        onConfirm={handleDelete}
        adminName={deletingAdmin?.name || ''}
        loading={isDeleting}
      />
    </div>
  )
}

export default Admins

