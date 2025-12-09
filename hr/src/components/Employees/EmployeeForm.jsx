import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../../services/api'
import SearchableSelect from '../Common/SearchableSelect'

function EmployeeForm({ employee, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: 'male',
    phone: '',
    hireDate: '',
    passport: '',
    address: '',
    departmentId: '',
    positionId: '',
  })
  const [errors, setErrors] = useState({})
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [loadingPositions, setLoadingPositions] = useState(false)

  useEffect(() => {
    fetchDepartments()
    fetchPositions()
  }, [])

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        middleName: employee.middleName || '',
        birthDate: employee.birthDate ? employee.birthDate.split('T')[0] : '',
        gender: employee.gender || 'male',
        phone: employee.phone || '',
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
        passport: employee.passport || '',
        address: employee.address || '',
        departmentId: employee.departmentId || '',
        positionId: employee.positionId || '',
      })
    }
  }, [employee])

  const fetchDepartments = async () => {
    setLoadingDepartments(true)
    const result = await apiService.getDepartments()
    if (result.success) {
      const normalized = (result.data.departments || []).map(dept => ({
        ...dept,
        id: dept.id || dept._id,
      }))
      setDepartments(normalized.filter(dept => dept.status === 'active'))
    }
    setLoadingDepartments(false)
  }

  const fetchPositions = async () => {
    setLoadingPositions(true)
    const result = await apiService.getPositions()
    if (result.success) {
      const normalized = (result.data.positions || []).map(pos => ({
        ...pos,
        id: pos.id || pos._id,
      }))
      setPositions(normalized.filter(pos => pos.status === 'active'))
    }
    setLoadingPositions(false)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ism to\'ldirilishi shart'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Familiya to\'ldirilishi shart'
    }

    if (!formData.middleName.trim()) {
      newErrors.middleName = 'Otasining ismi to\'ldirilishi shart'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Tug\'ilgan sana to\'ldirilishi shart'
    }

    if (!formData.gender) {
      newErrors.gender = 'Jinsi tanlanishi shart'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqami to\'ldirilishi shart'
    } else if (!/^\+998\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'Ishga kirgan sana to\'ldirilishi shart'
    }

    if (!formData.passport.trim()) {
      newErrors.passport = 'Pasport seriya va raqami to\'ldirilishi shart'
    } else if (!/^[A-Z]{2}\d{7}$/.test(formData.passport.toUpperCase())) {
      newErrors.passport = 'Pasport seriya va raqami AA1234567 formatida bo\'lishi kerak'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Manzil to\'ldirilishi shart'
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Bo\'lim tanlanishi shart'
    }

    if (!formData.positionId) {
      newErrors.positionId = 'Lavozim tanlanishi shart'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      const submitData = {
        ...formData,
        passport: formData.passport.toUpperCase(),
      }
      onSubmit(submitData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8 overflow-x-visible"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {employee ? 'Xodimni tahrirlash' : 'Yangi xodim qo\'shish'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ism <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ism"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Familiya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Familiya"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otasining ismi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.middleName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="O'g'li/Qizi"
                />
                {errors.middleName && (
                  <p className="mt-1 text-sm text-red-500">{errors.middleName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tug'ilgan sana <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jinsi <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="male">Erkak</option>
                  <option value="female">Ayol</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon raqami <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+998901234567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ishga kirgan sana <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.hireDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hireDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.hireDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pasport seriya va raqami <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="passport"
                  value={formData.passport}
                  onChange={handleChange}
                  maxLength={9}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${
                    errors.passport ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="AB1234567"
                />
                {errors.passport && (
                  <p className="mt-1 text-sm text-red-500">{errors.passport}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manzil <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Toshkent shahar, Yunusobod tumani"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SearchableSelect
                  label="Bo'lim"
                  value={formData.departmentId}
                  onChange={(value) => handleSelectChange('departmentId', value)}
                  options={departments}
                  getOptionLabel={(option) => option.nom}
                  getOptionValue={(option) => option.id || option._id}
                  placeholder="Bo'limni tanlang"
                  searchPlaceholder="Bo'lim qidirish..."
                  loading={loadingDepartments}
                  error={errors.departmentId}
                  required
                />
              </div>

              <div>
                <SearchableSelect
                  label="Lavozim"
                  value={formData.positionId}
                  onChange={(value) => handleSelectChange('positionId', value)}
                  options={positions}
                  getOptionLabel={(option) => option.nom}
                  getOptionValue={(option) => option.id || option._id}
                  placeholder="Lavozimni tanlang"
                  searchPlaceholder="Lavozim qidirish..."
                  loading={loadingPositions}
                  error={errors.positionId}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saqlanmoqda...' : employee ? 'Saqlash' : 'Qo\'shish'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EmployeeForm

