import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import PositionList from '../components/Positions/PositionList'
import PositionForm from '../components/Positions/PositionForm'
import DeletePositionModal from '../components/Positions/DeletePositionModal'

function Positions() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPosition, setEditingPosition] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingPosition, setDeletingPosition] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    setLoading(true)
    const result = await apiService.getPositions()
    
    if (result.success) {
      // Normalize position data - convert _id to id if needed
      const normalizedPositions = (result.data.positions || []).map(position => ({
        ...position,
        id: position.id || position._id,
      }))
      setPositions(normalizedPositions)
    } else {
      showError(result.error || 'Lavozimlarni yuklashda xatolik yuz berdi')
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingPosition(null)
    setShowForm(true)
  }

  const handleEdit = (position) => {
    setEditingPosition(position)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    setFormLoading(true)

    let result
    if (editingPosition) {
      const positionId = editingPosition.id || editingPosition._id
      // Update position - only nom field is allowed
      result = await apiService.updatePosition(positionId, { nom: formData.nom })
    } else {
      result = await apiService.createPosition(formData)
    }

    if (result.success) {
      setShowForm(false)
      setEditingPosition(null)
      showSuccess(editingPosition ? 'Lavozim muvaffaqiyatli yangilandi' : 'Lavozim muvaffaqiyatli yaratildi')
      await fetchPositions()
    } else {
      showError(result.error || 'Xatolik yuz berdi')
    }
    setFormLoading(false)
  }

  const handleStatusChange = async (id, status) => {
    const result = await apiService.updatePositionStatus(id, status)
    
    if (result.success) {
      const statusText = status === 'active' ? 'faol' : 'nofaol'
      showSuccess(`Lavozim statusi "${statusText}" ga o'zgartirildi`)
      await fetchPositions()
    } else {
      showError(result.error || 'Statusni o\'zgartirishda xatolik yuz berdi')
    }
  }

  const handleDeleteClick = (id, name) => {
    setDeletingPosition({ id, name })
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingPosition) return
    
    setIsDeleting(true)
    const result = await apiService.deletePosition(deletingPosition.id)
    
    if (result.success) {
      showSuccess('Lavozim muvaffaqiyatli o\'chirildi')
      setShowDeleteModal(false)
      setDeletingPosition(null)
      await fetchPositions()
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
              Lavozimlar
            </h1>
            <p className="text-gray-600">
              Kompaniya lavozimlarini boshqarish
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
            Yangi lavozim
          </motion.button>
        </div>
      </motion.div>

      <PositionList
        positions={positions}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        onStatusChange={handleStatusChange}
        loading={loading}
      />

      {showForm && (
        <PositionForm
          position={editingPosition}
          onClose={() => {
            setShowForm(false)
            setEditingPosition(null)
          }}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      )}

      <DeletePositionModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingPosition(null)
        }}
        onConfirm={handleDelete}
        positionName={deletingPosition?.name || ''}
        loading={isDeleting}
      />
    </div>
  )
}

export default Positions







