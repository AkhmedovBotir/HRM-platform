import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchVacancies } from '../services/api';
import VacancyCard from '../components/VacancyCard';
import FilterPanel from '../components/FilterPanel';

export default function VacancyList() {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    daraja: '',
    skills: '',
    companyId: '',
    departmentId: '',
    positionId: '',
    minApplicationCount: '',
    sortBy: '',
    sortOrder: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    count: 0
  });

  // Extract unique companies, departments, and positions from vacancies
  // Filter and sort them based on the returned data
  const { companies, departments, positions } = useMemo(() => {
    const companiesMap = new Map();
    const departmentsMap = new Map();
    const positionsMap = new Map();

    vacancies.forEach(vacancy => {
      if (vacancy.companyId?._id && vacancy.companyId?.nom) {
        companiesMap.set(vacancy.companyId._id, {
          _id: vacancy.companyId._id,
          nom: vacancy.companyId.nom,
          INN: vacancy.companyId.INN
        });
      }
      if (vacancy.departmentId?._id && vacancy.departmentId?.nom) {
        departmentsMap.set(vacancy.departmentId._id, {
          _id: vacancy.departmentId._id,
          nom: vacancy.departmentId.nom
        });
      }
      if (vacancy.positionId?._id && vacancy.positionId?.nom) {
        positionsMap.set(vacancy.positionId._id, {
          _id: vacancy.positionId._id,
          nom: vacancy.positionId.nom
        });
      }
    });

    // Convert to arrays and sort alphabetically
    const companiesArray = Array.from(companiesMap.values()).sort((a, b) => 
      a.nom.localeCompare(b.nom, 'uz')
    );
    const departmentsArray = Array.from(departmentsMap.values()).sort((a, b) => 
      a.nom.localeCompare(b.nom, 'uz')
    );
    const positionsArray = Array.from(positionsMap.values()).sort((a, b) => 
      a.nom.localeCompare(b.nom, 'uz')
    );

    return {
      companies: companiesArray,
      departments: departmentsArray,
      positions: positionsArray
    };
  }, [vacancies]);

  // Fetch vacancies
  useEffect(() => {
    const loadVacancies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchVacancies(filters);
        setVacancies(data.vacancies || []);
        setPagination({
          page: data.page || 1,
          totalPages: data.totalPages || 1,
          total: data.total || 0,
          count: data.count || 0
        });
      } catch (err) {
        setError('Vakansiyalarni yuklashda xatolik yuz berdi');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadVacancies();
  }, [filters]);

  // Filter vacancies by search query (client-side for better UX)
  const filteredVacancies = useMemo(() => {
    if (!searchQuery.trim()) {
      return vacancies;
    }

    const query = searchQuery.toLowerCase();
    return vacancies.filter(vacancy => {
      return (
        vacancy.nom?.toLowerCase().includes(query) ||
        vacancy.companyId?.nom?.toLowerCase().includes(query) ||
        vacancy.departmentId?.nom?.toLowerCase().includes(query) ||
        vacancy.positionId?.nom?.toLowerCase().includes(query) ||
        vacancy.skills?.some(skill => skill.toLowerCase().includes(query)) ||
        vacancy.description?.toLowerCase().includes(query)
      );
    });
  }, [vacancies, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleVacancyClick = (vacancy) => {
    navigate(`/vacancy/${vacancy._id}`);
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Ish Topish Platformasi</h1>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{pagination.total}</span> ta vakansiya
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ish, kompaniya, bo'lim yoki ko'nikma bo'yicha qidiring..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                isFilterOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            isOpen={isFilterOpen}
            filters={filters}
            onFilterChange={handleFilterChange}
            companies={companies}
            departments={departments}
            positions={positions}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Vakansiyalar yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {/* Vacancies Grid */}
        {!loading && !error && (
          <>
            {filteredVacancies.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vakansiyalar topilmadi</h3>
                <p className="text-gray-600">Qidiruv shartlarini o'zgartirib ko'ring</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  <span className="font-semibold">{filteredVacancies.length}</span> ta vakansiya topildi
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredVacancies.map((vacancy) => (
                    <VacancyCard
                      key={vacancy._id}
                      vacancy={vacancy}
                      onClick={handleVacancyClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Oldingi
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Keyingi
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

