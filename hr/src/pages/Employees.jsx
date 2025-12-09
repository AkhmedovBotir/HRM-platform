import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import EmployeeList from '../components/Employees/EmployeeList'
import EmployeeForm from '../components/Employees/EmployeeForm'
import DeleteEmployeeModal from '../components/Employees/DeleteEmployeeModal'
import EmployeeDetailModal from '../components/Employees/EmployeeDetailModal'
import TerminateEmployeeModal from '../components/Employees/TerminateEmployeeModal'
import EmployeeCredentialsModal from '../components/Employees/EmployeeCredentialsModal'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingEmployee, setDeletingEmployee] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [viewingEmployee, setViewingEmployee] = useState(null)
  const [showTerminateModal, setShowTerminateModal] = useState(false)
  const [terminatingEmployee, setTerminatingEmployee] = useState(null)
  const [isTerminating, setIsTerminating] = useState(false)
  const [filterTerminated, setFilterTerminated] = useState(undefined) // undefined = all, true = terminated, false = active
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [credentialsEmployee, setCredentialsEmployee] = useState(null)
  const { showError, showSuccess } = useSnackbar()

  useEffect(() => {
    fetchEmployees()
  }, [filterTerminated])

  const fetchEmployees = async () => {
    setLoading(true)
    const terminatedParam = filterTerminated === undefined ? undefined : String(filterTerminated)
    const result = await apiService.getEmployees(terminatedParam)
    
    if (result.success) {
      // Normalize employee data - convert _id to id if needed
      const normalizedEmployees = (result.data.employees || []).map(employee => ({
        ...employee,
        id: employee.id || employee._id,
        departmentId: employee.departmentId?._id || employee.departmentId?.id || employee.departmentId,
        positionId: employee.positionId?._id || employee.positionId?.id || employee.positionId,
        departmentName: employee.departmentId?.nom || employee.departmentName,
        positionName: employee.positionId?.nom || employee.positionName,
      }))
      setEmployees(normalizedEmployees)
    } else {
      showError(result.error || 'Xodimlarni yuklashda xatolik yuz berdi')
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingEmployee(null)
    setShowForm(true)
  }

  const handleView = (employee) => {
    setViewingEmployee(employee)
    setShowDetailModal(true)
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    setFormLoading(true)

    let result
    if (editingEmployee) {
      const employeeId = editingEmployee.id || editingEmployee._id
      result = await apiService.updateEmployee(employeeId, formData)
    } else {
      result = await apiService.createEmployee(formData)
    }

    if (result.success) {
      setShowForm(false)
      setEditingEmployee(null)
      showSuccess(editingEmployee ? 'Xodim muvaffaqiyatli yangilandi' : 'Xodim muvaffaqiyatli yaratildi')
      await fetchEmployees()
    } else {
      showError(result.error || 'Xatolik yuz berdi')
    }
    setFormLoading(false)
  }

  const handleDeleteClick = (id, name) => {
    const employee = employees.find(emp => (emp.id || emp._id) === id)
    const fullName = employee ? `${employee.firstName} ${employee.lastName}` : name
    setDeletingEmployee({ id, name: fullName })
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingEmployee) return
    
    setIsDeleting(true)
    const result = await apiService.deleteEmployee(deletingEmployee.id)
    
    if (result.success) {
      showSuccess('Xodim muvaffaqiyatli o\'chirildi')
      setShowDeleteModal(false)
      setDeletingEmployee(null)
      await fetchEmployees()
    } else {
      showError(result.error || 'O\'chirishda xatolik yuz berdi')
    }
    setIsDeleting(false)
  }

  const handleTerminateClick = (employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`
    setTerminatingEmployee({ id: employee.id || employee._id, name: fullName, employee })
    setShowTerminateModal(true)
  }

  const handleCredentialsClick = (employee) => {
    setCredentialsEmployee(employee)
    setShowCredentialsModal(true)
  }

  const handleTerminate = async (terminationData) => {
    if (!terminatingEmployee) return
    
    setIsTerminating(true)
    const result = await apiService.terminateEmployee(terminatingEmployee.id, terminationData)
    
    if (result.success) {
      showSuccess('Xodim muvaffaqiyatli ishdan bo\'shatildi')
      setShowTerminateModal(false)
      setTerminatingEmployee(null)
      await fetchEmployees()
    } else {
      showError(result.error || 'Ishdan bo\'shatishda xatolik yuz berdi')
    }
    setIsTerminating(false)
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Xodimlar
            </h1>
            <p className="text-gray-600">
              Kompaniya xodimlarini boshqarish
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
            Yangi xodim
          </motion.button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterTerminated(undefined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterTerminated === undefined
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Barcha
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterTerminated(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterTerminated === false
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ishda
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterTerminated(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterTerminated === true
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ishdan bo'shatilgan
            </motion.button>
          </div>
        </div>
      </motion.div>

      <EmployeeList
        employees={employees}
        onView={handleView}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
        loading={loading}
      />

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={() => {
            setShowForm(false)
            setEditingEmployee(null)
          }}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      )}

      <DeleteEmployeeModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingEmployee(null)
        }}
        onConfirm={handleDelete}
        employeeName={deletingEmployee?.name || ''}
        loading={isDeleting}
      />

      <EmployeeDetailModal
        show={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setViewingEmployee(null)
        }}
        employee={viewingEmployee}
        onEdit={handleEdit}
        onTerminate={handleTerminateClick}
        onCredentials={handleCredentialsClick}
      />

      <TerminateEmployeeModal
        show={showTerminateModal}
        onClose={() => {
          setShowTerminateModal(false)
          setTerminatingEmployee(null)
        }}
        onConfirm={handleTerminate}
        employeeName={terminatingEmployee?.name || ''}
        loading={isTerminating}
      />

      <EmployeeCredentialsModal
        show={showCredentialsModal}
        onClose={() => {
          setShowCredentialsModal(false)
          setCredentialsEmployee(null)
        }}
        employee={credentialsEmployee}
      />
    </div>
  )
}

export default Employees

