const API_BASE_URL = 'http://localhost:3000/api'

class ApiService {
  getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = user?.token || user?.accessToken
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Xatolik yuz berdi' }
    }
  }

  // Company APIs
  async getCompanies() {
    try {
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Kompaniyalarni olishda xatolik')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Xatolik yuz berdi' }
    }
  }

  async getCompany(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Kompaniya topilmadi')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Xatolik yuz berdi' }
    }
  }

  async createCompany(companyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ...companyData, status: 'active' }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Kompaniya yaratishda xatolik')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Xatolik yuz berdi' }
    }
  }

  async updateCompany(id, companyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(companyData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Kompaniyani yangilashda xatolik')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Xatolik yuz berdi' }
    }
  }

  async deleteCompany(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Kompaniyani o\'chirishda xatolik')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Xatolik yuz berdi' }
    }
  }

  async updateCompanyStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Kompaniya statusini yangilashda xatolik')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Xatolik yuz berdi' }
    }
  }
}

export default new ApiService()

