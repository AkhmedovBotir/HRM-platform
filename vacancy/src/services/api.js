const API_BASE_URL = 'http://localhost:3000/api';

export const fetchVacancies = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value);
      }
    }
  });

  const url = `${API_BASE_URL}/vacancy${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch vacancies');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    throw error;
  }
};

export const fetchVacancyStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacancy/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const fetchApplicationForm = async (vacancyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/application-form/vacancy/${vacancyId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // So'rovnoma yo'q
      }
      throw new Error('Failed to fetch application form');
    }
    
    const data = await response.json();
    return data.form || null;
  } catch (error) {
    console.error('Error fetching application form:', error);
    throw error;
  }
};

export const submitApplication = async (vacancyId, answers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vacancyId,
        answers
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Ariza topshirishda xatolik yuz berdi');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

