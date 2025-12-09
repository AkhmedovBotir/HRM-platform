import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import DepartmentList from '../components/Departments/DepartmentList'
import DepartmentForm from '../components/Departments/DepartmentForm'
import DeleteDepartmentModal from '../components/Departments/DeleteDepartmentModal'

function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingDepartment, setDeletingDepartment] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    setLoading(true)
    const result = await apiService.getDepartments()
    
    if (result.success) {
      // Normalize department data - convert _id to id if needed
      const normalizedDepartments = (result.data.departments || []).map(department => ({
        ...department,
        id: department.id || department._id,
      }))
      setDepartments(normalizedDepartments)
    } else {
      showError(result.error || 'Bo\'limlarni yuklashda xatolik yuz berdi')
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingDepartment(null)
    setShowForm(true)
  }

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    setFormLoading(true)

    let result
    if (editingDepartment) {
      const departmentId = editingDepartment.id || editingDepartment._id
      result = await apiService.updateDepartment(departmentId, formData)
    } else {
      result = await apiService.createDepartment(formData)
    }

    if (result.success) {
      setShowForm(false)
      setEditingDepartment(null)
      showSuccess(editingDepartment ? 'Bo\'lim muvaffaqiyatli yangilandi' : 'Bo\'lim muvaffaqiyatli yaratildi')
      await fetchDepartments()
    } else {
      showError(result.error || 'Xatolik yuz berdi')
    }
    setFormLoading(false)
  }

  const handleStatusChange = async (id, status) => {
    const result = await apiService.updateDepartmentStatus(id, status)
    
    if (result.success) {
      const statusText = status === 'active' ? 'faol' : 'nofaol'
      showSuccess(`Bo'lim statusi "${statusText}" ga o'zgartirildi`)
      await fetchDepartments()
    } else {
      showError(result.error || 'Statusni o\'zgartirishda xatolik yuz berdi')
    }
  }

  const handleDeleteClick = (id, name) => {
    setDeletingDepartment({ id, name })
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingDepartment) return
    
    setIsDeleting(true)
    const result = await apiService.deleteDepartment(deletingDepartment.id)
    
    if (result.success) {
      showSuccess('Bo\'lim muvaffaqiyatli o\'chirildi')
      setShowDeleteModal(false)
      setDeletingDepartment(null)
      await fetchDepartments()
    } else {
      showError(result.error || 'O\'chirishda xatolik yuz berdi')
    }
    setIsDeleting(false)
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
              Bo'limlar
            </h1>
            <p className="text-gray-600">
              Kompaniya bo'limlarini boshqarish
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
            Yangi bo'lim
          </motion.button>
        </div>
      </motion.div>

      <DepartmentList
        departments={departments}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        onStatusChange={handleStatusChange}
        loading={loading}
      />

      {showForm && (
        <DepartmentForm
          department={editingDepartment}
          onClose={() => {
            setShowForm(false)
            setEditingDepartment(null)
          }}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      )}

      <DeleteDepartmentModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingDepartment(null)
        }}
        onConfirm={handleDelete}
        departmentName={deletingDepartment?.name || ''}
        loading={isDeleting}
      />
    </div>
  )
}

export default Departments

