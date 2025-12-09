// API base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Get token from localStorage
const getToken = () => {
  const user = localStorage.getItem('user')
  if (user) {
    try {
      const userData = JSON.parse(user)
      return userData.token
    } catch (e) {
      return null
    }
  }
  return null
}

// Get auth headers
const getAuthHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

const apiService = {
  /**
   * Login function
   * @param {string} username - Company username
   * @param {string} password - Company password
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Login failed',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get all company admins
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getAdmins() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/admin`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch admins',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get admins error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single company admin
   * @param {string} id - Admin ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getAdmin(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Admin ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/admin/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch admin',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get admin error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Create company admin
   * @param {object} adminData - Admin data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createAdmin(adminData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/admin`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(adminData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to create admin',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create admin error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update company admin
   * @param {string} id - Admin ID
   * @param {object} adminData - Admin data to update
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateAdmin(id, adminData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Admin ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/admin/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(adminData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update admin',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update admin error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update company admin status
   * @param {string} id - Admin ID
   * @param {string} status - Status (active/inactive)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateAdminStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Admin ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/admin/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update admin status',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update admin status error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete company admin
   * @param {string} id - Admin ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteAdmin(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Admin ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to delete admin',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete admin error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get all company departments
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getDepartments() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/department`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch departments',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get departments error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single company department
   * @param {string} id - Department ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getDepartment(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Department ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/department/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch department',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get department error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Create company department
   * @param {object} departmentData - Department data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createDepartment(departmentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/department`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(departmentData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to create department',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create department error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update company department
   * @param {string} id - Department ID
   * @param {object} departmentData - Department data to update
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateDepartment(id, departmentData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Department ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/department/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(departmentData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update department',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update department error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update company department status
   * @param {string} id - Department ID
   * @param {string} status - Status (active/inactive)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateDepartmentStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Department ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/department/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update department status',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update department status error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete company department
   * @param {string} id - Department ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteDepartment(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Department ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/department/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to delete department',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete department error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Position APIs ====================

  /**
   * Get all company positions
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getPositions() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/position`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch positions',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get positions error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single position by ID
   * @param {string} id - Position ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getPosition(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Position ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/position/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch position',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get position error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Create new position
   * @param {object} positionData - Position data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createPosition(positionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/position`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(positionData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to create position',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create position error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update company position
   * @param {string} id - Position ID
   * @param {object} positionData - Position data to update (only nom field)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updatePosition(id, positionData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Position ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/position/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(positionData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update position',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update position error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update position status
   * @param {string} id - Position ID
   * @param {string} status - New status (active/inactive)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updatePositionStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Position ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/position/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update position status',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update position status error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete company position
   * @param {string} id - Position ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deletePosition(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Position ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/position/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to delete position',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete position error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Employee APIs ====================

  /**
   * Get all company employees
   * @param {string} terminated - Filter by termination status: 'true', 'false', or undefined for all
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getEmployees(terminated = undefined) {
    try {
      let url = `${API_BASE_URL}/api/company/employee`
      if (terminated !== undefined) {
        url += `?terminated=${terminated}`
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch employees',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get employees error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single employee by ID
   * @param {string} id - Employee ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getEmployee(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Employee ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/employee/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch employee',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get employee error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Create new employee
   * @param {object} employeeData - Employee data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createEmployee(employeeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/employee`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to create employee',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create employee error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update company employee
   * @param {string} id - Employee ID
   * @param {object} employeeData - Employee data to update
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateEmployee(id, employeeData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Employee ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/employee/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(employeeData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update employee',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update employee error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete company employee
   * @param {string} id - Employee ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteEmployee(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Employee ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/employee/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to delete employee',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete employee error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Terminate employee
   * @param {string} id - Employee ID
   * @param {object} terminationData - Termination data (terminationDate, terminationReason)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async terminateEmployee(id, terminationData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Employee ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/employee/${id}/terminate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(terminationData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to terminate employee',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Terminate employee error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Attendance APIs ====================

  /**
   * Create or update attendance
   * @param {object} attendanceData - Attendance data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createOrUpdateAttendance(attendanceData) {
    try {
      // Validate required fields
      if (!attendanceData.employeeId) {
        return {
          success: false,
          error: 'Xodim tanlanishi shart',
        }
      }
      if (!attendanceData.date) {
        return {
          success: false,
          error: 'Sana tanlanishi shart',
        }
      }

      // Clean up the data - remove null values for optional fields if they're empty
      const cleanedData = {
        employeeId: attendanceData.employeeId,
        date: attendanceData.date,
        status: attendanceData.status || 'absent',
      }

      // Only include checkIn if it's provided
      if (attendanceData.checkIn) {
        cleanedData.checkIn = attendanceData.checkIn
      }

      // Only include checkOut if it's provided
      if (attendanceData.checkOut) {
        cleanedData.checkOut = attendanceData.checkOut
      }

      // Only include notes if it's provided
      if (attendanceData.notes) {
        cleanedData.notes = attendanceData.notes
      }


      const response = await fetch(`${API_BASE_URL}/api/company/attendance`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Attendance API error:', data)
        return {
          success: false,
          error: data.message || data.error || 'Failed to create/update attendance',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create/update attendance error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get all attendances with filters
   * @param {object} filters - Filter options (employeeId, startDate, endDate, status)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getAttendances(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (filters.employeeId) queryParams.append('employeeId', filters.employeeId)
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)
      if (filters.status) queryParams.append('status', filters.status)

      const url = `${API_BASE_URL}/api/company/attendance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch attendances',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get attendances error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single attendance by ID
   * @param {string} id - Attendance ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getAttendance(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Attendance ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/attendance/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch attendance',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get attendance error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update attendance
   * @param {string} id - Attendance ID
   * @param {object} attendanceData - Attendance data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateAttendance(id, attendanceData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Attendance ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/attendance/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update attendance',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update attendance error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete attendance
   * @param {string} id - Attendance ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async deleteAttendance(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Attendance ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/attendance/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to delete attendance',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete attendance error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Work Schedule Template APIs ====================

  /**
   * Create schedule template
   * @param {object} templateData - Template data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createScheduleTemplate(templateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/schedule-template`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to create schedule template',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create schedule template error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get all schedule templates
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getScheduleTemplates() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/schedule-template`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch schedule templates',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get schedule templates error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single schedule template
   * @param {string} id - Template ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getScheduleTemplate(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Template ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/schedule-template/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch schedule template',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get schedule template error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update schedule template
   * @param {string} id - Template ID
   * @param {object} templateData - Template data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateScheduleTemplate(id, templateData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Template ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/schedule-template/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update schedule template',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update schedule template error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update schedule template status
   * @param {string} id - Template ID
   * @param {string} status - Status (active/inactive)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateScheduleTemplateStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Template ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/schedule-template/${id}/status`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update schedule template status',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update schedule template status error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete schedule template
   * @param {string} id - Template ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async deleteScheduleTemplate(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Template ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/schedule-template/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to delete schedule template',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete schedule template error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Employee Schedule APIs ====================

  /**
   * Create employee schedule
   * @param {object} scheduleData - Schedule data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createEmployeeSchedule(scheduleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/employee-schedule`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to create employee schedule',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create employee schedule error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get all employee schedules with filters
   * @param {object} filters - Filter options (employeeId, templateId, startDate, endDate, status)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getEmployeeSchedules(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (filters.employeeId) queryParams.append('employeeId', filters.employeeId)
      if (filters.templateId) queryParams.append('templateId', filters.templateId)
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)
      if (filters.status) queryParams.append('status', filters.status)

      const url = `${API_BASE_URL}/api/company/employee-schedule${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch employee schedules',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get employee schedules error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single employee schedule
   * @param {string} id - Employee Schedule ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getEmployeeSchedule(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Employee Schedule ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/employee-schedule/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch employee schedule',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get employee schedule error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update employee schedule
   * @param {string} id - Employee Schedule ID
   * @param {object} scheduleData - Schedule data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateEmployeeSchedule(id, scheduleData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Employee Schedule ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/employee-schedule/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update employee schedule',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update employee schedule error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update employee schedule status
   * @param {string} id - Employee Schedule ID
   * @param {string} status - Status (active/inactive)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateEmployeeScheduleStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Employee Schedule ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/employee-schedule/${id}/status`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update employee schedule status',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update employee schedule status error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete employee schedule
   * @param {string} id - Employee Schedule ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async deleteEmployeeSchedule(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Employee Schedule ID topilmadi',
        }
      }
      const response = await fetch(`${API_BASE_URL}/api/company/employee-schedule/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to delete employee schedule',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete employee schedule error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Vacancy APIs ====================

  /**
   * Get all company vacancies with optional status filter
   * @param {string} status - Optional status filter (active/close)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getVacancies(status) {
    try {
      const query = new URLSearchParams()
      if (status) {
        query.append('status', status)
      }

      const url = `${API_BASE_URL}/api/company/vacancy${query.toString() ? `?${query.toString()}` : ''}`
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch vacancies',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get vacancies error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single vacancy
   * @param {string} id - Vacancy ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getVacancy(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Vacancy ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/vacancy/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to fetch vacancy',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get vacancy error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Create new vacancy
   * @param {object} vacancyData - Vacancy payload
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createVacancy(vacancyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/vacancy`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacancyData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to create vacancy',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create vacancy error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update vacancy (without status/application count)
   * @param {string} id - Vacancy ID
   * @param {object} vacancyData - Updated data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateVacancy(id, vacancyData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Vacancy ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/vacancy/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacancyData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update vacancy',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update vacancy error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update vacancy status (active/close)
   * @param {string} id - Vacancy ID
   * @param {string} status - New status
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateVacancyStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Vacancy ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/vacancy/${id}/status`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update vacancy status',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update vacancy status error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update vacancy application count
   * @param {string} id - Vacancy ID
   * @param {number} applicationCount - New application count
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateVacancyApplicationCount(id, applicationCount) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Vacancy ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/vacancy/${id}/application-count`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationCount }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update application count',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update vacancy application count error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete vacancy
   * @param {string} id - Vacancy ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async deleteVacancy(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Vacancy ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/vacancy/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to delete vacancy',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete vacancy error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Application Form APIs ====================

  /**
   * Create application form
   * @param {object} formData - Application form data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createApplicationForm(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/application-form`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'So\'rovnoma yaratishda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create application form error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get all application forms
   * @param {object} filters - Optional filters (vacancyId, status)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getApplicationForms(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (filters.vacancyId) queryParams.append('vacancyId', filters.vacancyId)
      if (filters.status) queryParams.append('status', filters.status)

      const url = `${API_BASE_URL}/api/company/application-form${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'So\'rovnomalarni yuklashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get application forms error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single application form by ID
   * @param {string} id - Application form ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getApplicationForm(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Application form ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/application-form/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'So\'rovnomani yuklashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get application form error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update application form
   * @param {string} id - Application form ID
   * @param {object} formData - Updated form data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateApplicationForm(id, formData) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Application form ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/application-form/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'So\'rovnomani yangilashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update application form error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update application form status
   * @param {string} id - Application form ID
   * @param {string} status - New status (active/inactive)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateApplicationFormStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Application form ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/application-form/${id}/status`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'So\'rovnoma statusini yangilashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update application form status error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Delete application form
   * @param {string} id - Application form ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async deleteApplicationForm(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Application form ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/application-form/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'So\'rovnomani o\'chirishda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete application form error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Application Submission APIs ====================

  /**
   * Get all application submissions
   * @param {object} filters - Optional filters (vacancyId, status)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getApplicationSubmissions(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (filters.vacancyId) queryParams.append('vacancyId', filters.vacancyId)
      if (filters.status) queryParams.append('status', filters.status)

      const url = `${API_BASE_URL}/api/company/application${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Arizalarni yuklashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get application submissions error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single application submission by ID
   * @param {string} id - Application submission ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getApplicationSubmission(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Application submission ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/application/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Arizani yuklashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get application submission error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Update application submission status
   * @param {string} id - Application submission ID
   * @param {string} status - New status (pending, accepted, rejected)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateApplicationSubmissionStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Application submission ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/application/${id}/status`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Ariza statusini yangilashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Update application submission status error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  // ==================== Interview APIs ====================

  /**
   * Create interview
   * @param {object} interviewData - Interview data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createInterview(interviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/interview`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Intervyu belgilashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Create interview error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get all interviews
   * @param {object} filters - Optional filters
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getInterviews(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (filters.vacancyId) queryParams.append('vacancyId', filters.vacancyId)
      if (filters.applicationSubmissionId) queryParams.append('applicationSubmissionId', filters.applicationSubmissionId)
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.interviewDateFrom) queryParams.append('interviewDateFrom', filters.interviewDateFrom)
      if (filters.interviewDateTo) queryParams.append('interviewDateTo', filters.interviewDateTo)
      if (filters.finalResult) queryParams.append('finalResult', filters.finalResult)
      if (filters.responseStatus) queryParams.append('responseStatus', filters.responseStatus)

      const url = `${API_BASE_URL}/api/company/interview${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Intervyularni yuklashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get interviews error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get single interview by ID
   * @param {string} id - Interview ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getInterview(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Interview ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Intervyuni yuklashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get interview error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Get interview by application submission ID
   * @param {string} applicationSubmissionId - Application submission ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getInterviewByApplication(applicationSubmissionId) {
    try {
      if (!applicationSubmissionId) {
        return {
          success: false,
          error: 'Application submission ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/application/${applicationSubmissionId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Intervyuni yuklashda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Get interview by application error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Add interview stage
   * @param {string} id - Interview ID
   * @param {object} stageData - Stage data (stageName, interviewDate, interviewTime, location, interviewer, notes)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async addInterviewStage(id, stageData) {
    try {
      if (!id) {
        return { success: false, error: 'Interview ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}/stage`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(stageData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Bosqich qo\'shishda xatolik' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Add interview stage error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Update interview stage
   * @param {string} id - Interview ID
   * @param {string} stageId - Stage ID
   * @param {object} stageData - Stage data to update
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateInterviewStage(id, stageId, stageData) {
    try {
      if (!id || !stageId) {
        return { success: false, error: 'Interview yoki Stage ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}/stage/${stageId}`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(stageData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Bosqichni yangilashda xatolik' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Update interview stage error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Cancel interview
   * @param {string} id - Interview ID
   * @param {string} reason - Cancel reason (optional)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async cancelInterview(id, reason) {
    try {
      if (!id) {
        return { success: false, error: 'Interview ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}/cancel`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Intervyuni bekor qilishda xatolik' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Cancel interview error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Delete interview
   * @param {string} id - Interview ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async deleteInterview(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Interview ID topilmadi',
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Intervyuni o\'chirishda xatolik yuz berdi',
        }
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error('Delete interview error:', error)
      return {
        success: false,
        error: error.message || 'Network error. Please try again.',
      }
    }
  },

  /**
   * Start interview
   * @param {string} id - Interview ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async startInterview(id) {
    try {
      if (!id) {
        return { success: false, error: 'Interview ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}/start`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Intervyuni boshlashda xatolik' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Start interview error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Complete interview with evaluation
   * @param {string} id - Interview ID
   * @param {object} evaluationData - Evaluation data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async completeInterview(id, evaluationData) {
    try {
      if (!id) {
        return { success: false, error: 'Interview ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}/complete`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Intervyuni yakunlashda xatolik' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Complete interview error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Make decision on interview
   * @param {string} id - Interview ID
   * @param {object} decisionData - Decision data (result, reason, decidedBy)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async makeInterviewDecision(id, decisionData) {
    try {
      if (!id) {
        return { success: false, error: 'Interview ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}/decision`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(decisionData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Qaror qabul qilishda xatolik' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Make decision error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Update response status
   * @param {string} id - Interview ID
   * @param {string} responseStatus - Response status (waiting/responded)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateInterviewResponse(id, responseStatus) {
    try {
      if (!id) {
        return { success: false, error: 'Interview ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}/response`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Javob statusini yangilashda xatolik' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Update response status error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Hire candidate - rasmiylashtirish
   * @param {string} id - Interview ID
   * @param {object} employeeData - Employee data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async hireCandidate(id, employeeData) {
    try {
      if (!id) {
        return { success: false, error: 'Interview ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/company/interview/${id}/hire`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Hodimni rasmiylashtirishda xatolik' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Hire candidate error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  // ==================== REFERRAL API ====================

  /**
   * Get employees for referral
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getReferralEmployees() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/referral/employees`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Xodimlarni yuklashda xatolik',
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get referral employees error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Submit referral application
   * @param {object} referralData - Referral data
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async submitReferral(referralData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/referral`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(referralData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Referal yuborishda xatolik',
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Submit referral error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Get all referrals
   * @param {object} filters - Optional filters (status, vacancyId, referralEmployeeId)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getReferrals(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.vacancyId) queryParams.append('vacancyId', filters.vacancyId)
      if (filters.referralEmployeeId) queryParams.append('referralEmployeeId', filters.referralEmployeeId)

      const url = `${API_BASE_URL}/api/referral${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Referallarni yuklashda xatolik',
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get referrals error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Get single referral by ID
   * @param {string} id - Referral ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async getReferral(id) {
    try {
      if (!id) {
        return { success: false, error: 'Referral ID topilmadi' }
      }

      const response = await fetch(`${API_BASE_URL}/api/referral/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Referalni yuklashda xatolik',
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get referral error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  // ==================== Employee Auth APIs ====================

  /**
   * Create employee credentials
   * @param {object} credentialsData - { employeeId, username?, password? }
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createEmployeeCredentials(credentialsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee-auth/create-credentials`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentialsData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Login ma\'lumotlarini yaratishda xatolik',
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Create employee credentials error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Reset employee password (Company Admin)
   * @param {object} resetData - { employeeId, newPassword? }
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async resetEmployeePassword(resetData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee-auth/reset-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resetData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Parolni tiklashda xatolik',
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Reset employee password error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },

  /**
   * Update employee credentials (Company Admin)
   * @param {object} updateData - { employeeId, username?, password? }
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async updateEmployeeCredentials(updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employee-auth/update-credentials`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Login ma\'lumotlarini yangilashda xatolik',
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Update employee credentials error:', error)
      return { success: false, error: error.message || 'Network error' }
    }
  },
}

export default apiService

