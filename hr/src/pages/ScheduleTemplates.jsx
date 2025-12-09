import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import ScheduleTemplateList from '../components/ScheduleTemplates/ScheduleTemplateList'
import ScheduleTemplateForm from '../components/ScheduleTemplates/ScheduleTemplateForm'
import DeleteScheduleTemplateModal from '../components/ScheduleTemplates/DeleteScheduleTemplateModal'

function ScheduleTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingTemplate, setDeletingTemplate] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    const result = await apiService.getScheduleTemplates()
    
    if (result.success) {
      const normalizedTemplates = (result.data.templates || []).map(template => ({
        ...template,
        id: template.id || template._id,
      }))
      setTemplates(normalizedTemplates)
    } else {
      showError(result.error || 'Shablonlarni yuklashda xatolik yuz berdi')
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingTemplate(null)
    setShowForm(true)
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    setFormLoading(true)

    let result
    if (editingTemplate) {
      const templateId = editingTemplate.id || editingTemplate._id
      result = await apiService.updateScheduleTemplate(templateId, formData)
    } else {
      result = await apiService.createScheduleTemplate(formData)
    }

    if (result.success) {
      setShowForm(false)
      setEditingTemplate(null)
      showSuccess(editingTemplate ? 'Shablon muvaffaqiyatli yangilandi' : 'Shablon muvaffaqiyatli yaratildi')
      await fetchTemplates()
    } else {
      showError(result.error || 'Xatolik yuz berdi')
    }
    setFormLoading(false)
  }

  const handleStatusChange = async (id, status) => {
    const result = await apiService.updateScheduleTemplateStatus(id, status)
    
    if (result.success) {
      const statusText = status === 'active' ? 'faol' : 'nofaol'
      showSuccess(`Shablon statusi "${statusText}" ga o'zgartirildi`)
      await fetchTemplates()
    } else {
      showError(result.error || 'Statusni o\'zgartirishda xatolik')
    }
  }

  const handleDeleteClick = (id, name) => {
    const template = templates.find(t => (t.id || t._id) === id)
    setDeletingTemplate({ id, name: name || template?.nom || 'Shablon' })
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingTemplate) return
    
    setIsDeleting(true)
    const result = await apiService.deleteScheduleTemplate(deletingTemplate.id)
    
    if (result.success) {
      showSuccess('Shablon muvaffaqiyatli o\'chirildi')
      setShowDeleteModal(false)
      setDeletingTemplate(null)
      await fetchTemplates()
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
              Ish grafik shablonlari
            </h1>
            <p className="text-gray-600">
              Ish grafik shablonlarini boshqarish
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
            Yangi shablon
          </motion.button>
        </div>
      </motion.div>

      <ScheduleTemplateList
        templates={templates}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        onStatusChange={handleStatusChange}
        loading={loading}
      />

      {showForm && (
        <ScheduleTemplateForm
          template={editingTemplate}
          onClose={() => {
            setShowForm(false)
            setEditingTemplate(null)
          }}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      )}

      <DeleteScheduleTemplateModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingTemplate(null)
        }}
        onConfirm={handleDelete}
        templateName={deletingTemplate?.name || ''}
        loading={isDeleting}
      />
    </div>
  )
}

export default ScheduleTemplates






