import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import VacancyList from '../components/Vacancies/VacancyList'
import VacancyForm from '../components/Vacancies/VacancyForm'
import DeleteVacancyModal from '../components/Vacancies/DeleteVacancyModal'
import VacancyDetailModal from '../components/Vacancies/VacancyDetailModal'
import UpdateApplicationCountModal from '../components/Vacancies/UpdateApplicationCountModal'
import ApplicationFormModal from '../components/Vacancies/ApplicationFormModal'

const FILTERS = [
  { value: 'all', label: 'Barcha' },
  { value: 'active', label: 'Faol' },
  { value: 'close', label: 'Yopiq' },
]

function Vacancies() {
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [detailVacancy, setDetailVacancy] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingVacancy, setDeletingVacancy] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [metaLoading, setMetaLoading] = useState(true)
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [schedules, setSchedules] = useState([])
  const [applicationModalOpen, setApplicationModalOpen] = useState(false)
  const [applicationTarget, setApplicationTarget] = useState(null)
  const [applicationLoading, setApplicationLoading] = useState(false)
  const [applicationFormModalOpen, setApplicationFormModalOpen] = useState(false)
  const [applicationFormTarget, setApplicationFormTarget] = useState(null)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchMetaData()
  }, [])

  useEffect(() => {
    fetchVacancies()
  }, [statusFilter])

  const fetchMetaData = async () => {
    setMetaLoading(true)
    try {
      const [departmentsRes, positionsRes, schedulesRes] = await Promise.all([
        apiService.getDepartments(),
        apiService.getPositions(),
        apiService.getScheduleTemplates(),
      ])

      if (departmentsRes.success) {
        const normalized = (departmentsRes.data?.departments || []).map((dept) => ({
          ...dept,
          id: dept.id || dept._id,
        }))
        setDepartments(normalized)
      }

      if (positionsRes.success) {
        const normalized = (positionsRes.data?.positions || []).map((pos) => ({
          ...pos,
          id: pos.id || pos._id,
        }))
        setPositions(normalized)
      }

      if (schedulesRes.success) {
        const normalized = (schedulesRes.data?.templates || schedulesRes.data?.scheduleTemplates || []).map((tpl) => ({
          ...tpl,
          id: tpl.id || tpl._id,
        }))
        setSchedules(normalized)
      }
    } catch (error) {
      console.error('Metadata fetch error:', error)
      showError('Yordamchi ma\'lumotlarni yuklashda xatolik yuz berdi')
    } finally {
      setMetaLoading(false)
    }
  }

  const fetchVacancies = async () => {
    setLoading(true)
    const filterParam = statusFilter === 'all' ? undefined : statusFilter
    const result = await apiService.getVacancies(filterParam)

    if (result.success) {
      const rawVacancies = result.data?.vacancies || []
      const normalized = rawVacancies.map((vacancy) => ({
        ...vacancy,
        id: vacancy.id || vacancy._id,
        departmentName: vacancy.departmentId?.nom || vacancy.departmentId?.name || vacancy.departmentName,
        positionName: vacancy.positionId?.nom || vacancy.positionName,
        workScheduleName: vacancy.workScheduleId?.nom || vacancy.workScheduleName,
      }))
      setVacancies(normalized)
    } else {
      showError(result.error || 'Vakansiyalarni yuklashda xatolik yuz berdi')
    }
    setLoading(false)
  }

  const handleFilterChange = (value) => {
    setStatusFilter(value)
  }

  const handleCreate = () => {
    setEditingVacancy(null)
    setShowForm(true)
  }

  const handleEdit = (vacancy) => {
    setEditingVacancy(vacancy)
    setShowForm(true)
  }

  const handleFormSubmit = async (formValues) => {
    setFormLoading(true)
    let result
    if (editingVacancy) {
      const vacancyId = editingVacancy.id || editingVacancy._id
      result = await apiService.updateVacancy(vacancyId, formValues)
    } else {
      result = await apiService.createVacancy(formValues)
    }

    if (result.success) {
      showSuccess(editingVacancy ? 'Vakansiya yangilandi' : 'Vakansiya yaratildi')
      setShowForm(false)
      setEditingVacancy(null)
      await fetchVacancies()
    } else {
      showError(result.error || 'Ma\'lumotlarni saqlashda xatolik yuz berdi')
    }
    setFormLoading(false)
  }

  const handleStatusChange = async (vacancy, status) => {
    const vacancyId = vacancy.id || vacancy._id
    const result = await apiService.updateVacancyStatus(vacancyId, status)
    if (result.success) {
      showSuccess('Vakansiya statusi yangilandi')
      await fetchVacancies()
    } else {
      showError(result.error || 'Statusni o\'zgartirishda xatolik yuz berdi')
    }
  }

  const handleDelete = async () => {
    if (!deletingVacancy) return
    setDeleteLoading(true)
    const result = await apiService.deleteVacancy(deletingVacancy.id || deletingVacancy._id)
    if (result.success) {
      showSuccess('Vakansiya o\'chirildi')
      setShowDeleteModal(false)
      setDeletingVacancy(null)
      await fetchVacancies()
    } else {
      showError(result.error || 'Vakansiyani o\'chirishda xatolik yuz berdi')
    }
    setDeleteLoading(false)
  }

  const handleApplicationModal = (vacancy) => {
    setApplicationTarget(vacancy)
    setApplicationModalOpen(true)
  }

  const handleApplicationUpdate = async (count) => {
    if (!applicationTarget) return
    setApplicationLoading(true)
    const vacancyId = applicationTarget.id || applicationTarget._id
    const result = await apiService.updateVacancyApplicationCount(vacancyId, count)
    if (result.success) {
      showSuccess('Ariza soni yangilandi')
      setApplicationModalOpen(false)
      setApplicationTarget(null)
      await fetchVacancies()
    } else {
      showError(result.error || 'Ariza sonini yangilashda xatolik yuz berdi')
    }
    setApplicationLoading(false)
  }

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">Vakansiyalar</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Vakansiyalar boshqaruvi</h1>
            <p className="text-gray-500 mt-2">Bo'sh ish o'rinlarini kuzatib boring va yangilarini yarating</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            disabled={metaLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-60"
          >
            Yangi vakansiya
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-blue-600 text-white shadow shadow-blue-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      <VacancyList
        vacancies={vacancies}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(vacancy) => {
          setDeletingVacancy(vacancy)
          setShowDeleteModal(true)
        }}
        onStatusChange={handleStatusChange}
        onView={(vacancy) => setDetailVacancy(vacancy)}
        onApplicationClick={handleApplicationModal}
        onApplicationFormClick={(vacancy) => {
          setApplicationFormTarget(vacancy)
          setApplicationFormModalOpen(true)
        }}
      />

      {showForm && (
        <VacancyForm
          vacancy={editingVacancy}
          departments={departments}
          positions={positions}
          schedules={schedules}
          onClose={() => {
            setShowForm(false)
            setEditingVacancy(null)
          }}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      )}

      <VacancyDetailModal
        vacancy={detailVacancy}
        onClose={() => setDetailVacancy(null)}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onApplicationClick={handleApplicationModal}
      />

      <DeleteVacancyModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingVacancy(null)
        }}
        onConfirm={handleDelete}
        vacancyTitle={deletingVacancy?.nom}
        loading={deleteLoading}
      />

      <UpdateApplicationCountModal
        show={applicationModalOpen}
        vacancy={applicationTarget}
        onClose={() => {
          setApplicationModalOpen(false)
          setApplicationTarget(null)
        }}
        onSubmit={handleApplicationUpdate}
        loading={applicationLoading}
      />

      {applicationFormModalOpen && (
        <ApplicationFormModal
          vacancy={applicationFormTarget}
          onClose={() => {
            setApplicationFormModalOpen(false)
            setApplicationFormTarget(null)
          }}
        />
      )}
    </div>
  )
}

export default Vacancies

