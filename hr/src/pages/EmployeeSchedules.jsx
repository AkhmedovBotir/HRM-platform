import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import EmployeeScheduleList from '../components/EmployeeSchedules/EmployeeScheduleList'
import EmployeeScheduleForm from '../components/EmployeeSchedules/EmployeeScheduleForm'
import DeleteEmployeeScheduleModal from '../components/EmployeeSchedules/DeleteEmployeeScheduleModal'

function EmployeeSchedules() {
  const [schedules, setSchedules] = useState([])
  const [employees, setEmployees] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingSchedule, setDeletingSchedule] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchSchedules()
    fetchEmployees()
    fetchTemplates()
  }, [])

  const fetchSchedules = async () => {
    setLoading(true)
    const result = await apiService.getEmployeeSchedules()
    
    if (result.success) {
      const normalizedSchedules = (result.data.schedules || []).map(schedule => ({
        ...schedule,
        id: schedule.id || schedule._id,
        employeeId: schedule.employeeId?._id || schedule.employeeId?.id || schedule.employeeId,
        templateId: schedule.templateId?._id || schedule.templateId?.id || schedule.templateId,
        employeeName: schedule.employeeId 
          ? `${schedule.employeeId.firstName || ''} ${schedule.employeeId.lastName || ''} ${schedule.employeeId.middleName || ''}`.trim()
          : schedule.employeeName || '',
        templateName: schedule.templateId?.nom || schedule.templateName || '',
      }))
      setSchedules(normalizedSchedules)
    } else {
      showError(result.error || 'Grafiklarni yuklashda xatolik yuz berdi')
    }
    setLoading(false)
  }

  const fetchEmployees = async () => {
    const result = await apiService.getEmployees(false)
    if (result.success) {
      const normalizedEmployees = (result.data.employees || []).map(emp => ({
        ...emp,
        id: emp.id || emp._id,
      }))
      setEmployees(normalizedEmployees.filter(emp => !emp.isTerminated))
    }
  }

  const fetchTemplates = async () => {
    const result = await apiService.getScheduleTemplates()
    if (result.success) {
      const normalizedTemplates = (result.data.templates || []).map(template => ({
        ...template,
        id: template.id || template._id,
      }))
      setTemplates(normalizedTemplates.filter(t => t.status === 'active'))
    }
  }

  const handleCreate = () => {
    setEditingSchedule(null)
    setShowForm(true)
  }

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    setFormLoading(true)

    let result
    if (editingSchedule) {
      const scheduleId = editingSchedule.id || editingSchedule._id
      result = await apiService.updateEmployeeSchedule(scheduleId, formData)
    } else {
      result = await apiService.createEmployeeSchedule(formData)
    }

    if (result.success) {
      setShowForm(false)
      setEditingSchedule(null)
      showSuccess(editingSchedule ? 'Grafik muvaffaqiyatli yangilandi' : 'Grafik muvaffaqiyatli yaratildi')
      await fetchSchedules()
    } else {
      showError(result.error || 'Xatolik yuz berdi')
    }
    setFormLoading(false)
  }

  const handleStatusChange = async (id, status) => {
    const result = await apiService.updateEmployeeScheduleStatus(id, status)
    
    if (result.success) {
      const statusText = status === 'active' ? 'faol' : 'nofaol'
      showSuccess(`Grafik statusi "${statusText}" ga o'zgartirildi`)
      await fetchSchedules()
    } else {
      showError(result.error || 'Statusni o\'zgartirishda xatolik')
    }
  }

  const handleDeleteClick = (id, name) => {
    const schedule = schedules.find(s => (s.id || s._id) === id)
    const displayName = name || `${schedule?.employeeName || 'Xodim'} - ${schedule?.templateName || 'Shablon'}` || 'Grafik'
    setDeletingSchedule({ id, name: displayName })
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingSchedule) return
    
    setIsDeleting(true)
    const result = await apiService.deleteEmployeeSchedule(deletingSchedule.id)
    
    if (result.success) {
      showSuccess('Grafik muvaffaqiyatli o\'chirildi')
      setShowDeleteModal(false)
      setDeletingSchedule(null)
      await fetchSchedules()
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
              Xodimlar grafiklari
            </h1>
            <p className="text-gray-600">
              Xodimlar uchun ish grafiklarini boshqarish
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
            Yangi grafik
          </motion.button>
        </div>
      </motion.div>

      <EmployeeScheduleList
        schedules={schedules}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        onStatusChange={handleStatusChange}
        loading={loading}
      />

      {showForm && (
        <EmployeeScheduleForm
          schedule={editingSchedule}
          employees={employees}
          templates={templates}
          onClose={() => {
            setShowForm(false)
            setEditingSchedule(null)
          }}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      )}

      <DeleteEmployeeScheduleModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingSchedule(null)
        }}
        onConfirm={handleDelete}
        scheduleName={deletingSchedule?.name || ''}
        loading={isDeleting}
      />
    </div>
  )
}

export default EmployeeSchedules






