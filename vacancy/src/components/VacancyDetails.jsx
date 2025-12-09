import { motion, AnimatePresence } from 'framer-motion';

export default function VacancyDetails({ vacancy, isOpen, onClose }) {
  if (!vacancy) return null;

  const getTypeColor = (type) => {
    switch (type) {
      case 'fulltime':
        return 'bg-blue-100 text-blue-800';
      case 'parttime':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDarajaColor = (daraja) => {
    switch (daraja) {
      case 'tajribasiz':
        return 'bg-purple-100 text-purple-800';
      case 'boshlang\'ich':
        return 'bg-yellow-100 text-yellow-800';
      case 'orta':
        return 'bg-orange-100 text-orange-800';
      case 'yuqori':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatHTML = (html) => {
    return { __html: html };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{vacancy.nom}</h2>
                    <div className="flex items-center gap-4 text-blue-100">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-semibold">{vacancy.companyId?.nom}</span>
                      </div>
                      <span>•</span>
                      <span>INN: {vacancy.companyId?.INN}</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getTypeColor(vacancy.type)}`}>
                    {vacancy.type === 'fulltime' ? 'To\'liq ish kuni' : 'Yarim ish kuni'}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDarajaColor(vacancy.daraja)}`}>
                    {vacancy.daraja}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                    {vacancy.departmentId?.nom}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                    {vacancy.positionId?.nom}
                  </span>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Maosh</p>
                    <p className="font-bold text-green-600">{vacancy.oylik}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ish jadvali</p>
                    <p className="font-semibold">{vacancy.workScheduleId?.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Yosh</p>
                    <p className="font-semibold">{vacancy.minAge} - {vacancy.maxAge} yosh</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Arizalar</p>
                    <p className="font-semibold">{vacancy.applicationCount} ta</p>
                  </div>
                </div>

                {/* Description */}
                {vacancy.description && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Tavsif</h3>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={formatHTML(vacancy.description)}
                    />
                  </div>
                )}

                {/* Responsibilities */}
                {vacancy.responsibilities && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Vazifalar</h3>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={formatHTML(vacancy.responsibilities)}
                    />
                  </div>
                )}

                {/* Preferences */}
                {vacancy.preferences && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Afzalliklar</h3>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={formatHTML(vacancy.preferences)}
                    />
                  </div>
                )}

                {/* Skills */}
                {vacancy.skills && vacancy.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Ko'nikmalar</h3>
                    <div className="flex flex-wrap gap-2">
                      {vacancy.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <p>Yaratilgan: {new Date(vacancy.createdAt).toLocaleDateString('uz-UZ')}</p>
                  {vacancy.updatedAt !== vacancy.createdAt && (
                    <p>Yangilangan: {new Date(vacancy.updatedAt).toLocaleDateString('uz-UZ')}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`px-3 py-1 rounded-full ${
                      vacancy.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vacancy.status === 'active' ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



