import VacancyCard from './VacancyCard'

function VacancyList({ vacancies = [], loading, onEdit, onDelete, onStatusChange, onView, onApplicationClick, onApplicationFormClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
            <div className="space-y-2 mb-6">
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (vacancies.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Vakansiyalar topilmadi</h3>
        <p className="text-gray-500">Yangi vakansiya qo'shish uchun yuqoridagi tugmadan foydalaning</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {vacancies.map((vacancy) => (
        <VacancyCard
          key={vacancy.id}
          vacancy={vacancy}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onView={onView}
          onApplicationClick={onApplicationClick}
          onApplicationFormClick={onApplicationFormClick}
        />
      ))}
    </div>
  )
}

export default VacancyList

