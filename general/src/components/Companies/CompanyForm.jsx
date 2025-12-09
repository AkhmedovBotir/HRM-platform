import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function CompanyForm({ company, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nom: '',
    INN: '',
    kompaniyaEgasi: '',
    kompaniyaEgasiTelefon: '',
    kompaniyaTelefon: '',
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (company) {
      setFormData({
        nom: company.nom || '',
        INN: company.INN || '',
        kompaniyaEgasi: company.kompaniyaEgasi || '',
        kompaniyaEgasiTelefon: company.kompaniyaEgasiTelefon || '',
        kompaniyaTelefon: company.kompaniyaTelefon || '',
        username: company.username || '',
        password: '',
      })
    }
  }, [company])

  const validatePhone = (phone) => {
    const phoneRegex = /^\+998\d{9}$/
    return phoneRegex.test(phone)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.nom.trim()) {
      newErrors.nom = 'Kompaniya nomi kiritilishi shart'
    }

    if (!formData.INN.trim()) {
      newErrors.INN = 'INN kiritilishi shart'
    }

    if (!formData.kompaniyaEgasi.trim()) {
      newErrors.kompaniyaEgasi = 'Kompaniya egasi kiritilishi shart'
    }

    if (!formData.kompaniyaEgasiTelefon.trim()) {
      newErrors.kompaniyaEgasiTelefon = 'Telefon raqami kiritilishi shart'
    } else if (!validatePhone(formData.kompaniyaEgasiTelefon)) {
      newErrors.kompaniyaEgasiTelefon = 'Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'
    }

    if (!formData.kompaniyaTelefon.trim()) {
      newErrors.kompaniyaTelefon = 'Telefon raqami kiritilishi shart'
    } else if (!validatePhone(formData.kompaniyaTelefon)) {
      newErrors.kompaniyaTelefon = 'Telefon raqami +998XXXXXXXXX formatida bo\'lishi kerak'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username kiritilishi shart'
    }

    if (!company && !formData.password.trim()) {
      newErrors.password = 'Parol kiritilishi shart'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgi bo\'lishi kerak'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      const dataToSend = { ...formData }
      if (company && !dataToSend.password) {
        delete dataToSend.password
      }
      onSave(dataToSend)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kompaniya nomi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tech Solutions MChJ"
          />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            INN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="INN"
            value={formData.INN}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.INN ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123456789"
          />
          {errors.INN && <p className="text-red-500 text-xs mt-1">{errors.INN}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kompaniya egasi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kompaniyaEgasi"
            value={formData.kompaniyaEgasi}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.kompaniyaEgasi ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ali Valiyev"
          />
          {errors.kompaniyaEgasi && <p className="text-red-500 text-xs mt-1">{errors.kompaniyaEgasi}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ega telefon raqami <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kompaniyaEgasiTelefon"
            value={formData.kompaniyaEgasiTelefon}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.kompaniyaEgasiTelefon ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+998901234567"
          />
          {errors.kompaniyaEgasiTelefon && <p className="text-red-500 text-xs mt-1">{errors.kompaniyaEgasiTelefon}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kompaniya telefon raqami <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kompaniyaTelefon"
            value={formData.kompaniyaTelefon}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.kompaniyaTelefon ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+998901234568"
          />
          {errors.kompaniyaTelefon && <p className="text-red-500 text-xs mt-1">{errors.kompaniyaTelefon}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="techsolutions"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parol {!company && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={company ? 'O\'zgartirish uchun kiriting' : 'password123'}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          {company && <p className="text-gray-500 text-xs mt-1">Parolni o'zgartirmasangiz bo'sh qoldiring</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Bekor qilish
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Saqlanmoqda...' : company ? 'Yangilash' : 'Yaratish'}
        </motion.button>
      </div>
    </form>
  )
}

export default CompanyForm

