import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchVacancies, fetchApplicationForm, submitApplication } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';

export default function VacancyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationForm, setApplicationForm] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState(null);

  useEffect(() => {
    const loadVacancy = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchVacancies({});
        const foundVacancy = data.vacancies?.find(v => v._id === id);
        if (foundVacancy) {
          setVacancy(foundVacancy);
        } else {
          setError('Vakansiya topilmadi');
        }
      } catch (err) {
        setError('Vakansiyani yuklashda xatolik yuz berdi');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVacancy();
    }
  }, [id]);

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

  const handleOpenApplicationForm = async () => {
    if (!vacancy || submitting) return;

    setLoadingForm(true);
    setApplicationError(null);
    setApplicationSuccess(false);

    try {
      const form = await fetchApplicationForm(vacancy._id);
      if (form) {
        setApplicationForm(form);
        setShowApplicationForm(true);
      } else {
        setApplicationError('Bu vakansiya uchun so\'rovnoma mavjud emas');
      }
    } catch (err) {
      setApplicationError(err.message || 'So\'rovnomani yuklashda xatolik yuz berdi');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleSubmitApplication = async (vacancyId, answers) => {
    setSubmitting(true);
    setApplicationError(null);
    setApplicationSuccess(false);

    try {
      const result = await submitApplication(vacancyId, answers);
      setApplicationSuccess(true);
      setShowApplicationForm(false);
      // Update vacancy to reflect new application count if returned
      if (result.vacancy) {
        setVacancy(result.vacancy);
      } else if (result.applicationCount !== undefined) {
        setVacancy({ ...vacancy, applicationCount: result.applicationCount });
      }
    } catch (err) {
      setApplicationError(err.message || 'Ariza topshirishda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Vakansiya yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{error || 'Vakansiya topilmadi'}</h3>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Orqaga</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Ish Topish Platformasi</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <h2 className="text-3xl font-bold mb-4">{vacancy.nom}</h2>
            <div className="flex items-center gap-2 text-blue-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold text-lg">{vacancy.companyId?.nom}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Badges - Improved Design */}
            <div className="flex flex-wrap gap-3 mb-8">
              {/* Ish turi badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${getTypeColor(vacancy.type)}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{vacancy.type === 'fulltime' ? 'To\'liq ish kuni' : 'Yarim ish kuni'}</span>
              </div>

              {/* Daraja badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${getDarajaColor(vacancy.daraja)}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="capitalize">{vacancy.daraja}</span>
              </div>

              {/* Bo'lim badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm bg-gray-100 text-gray-800 border border-gray-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{vacancy.departmentId?.nom}</span>
              </div>

              {/* Pozitsiya badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm bg-gray-100 text-gray-800 border border-gray-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{vacancy.positionId?.nom}</span>
              </div>
            </div>

            {/* Key Info - New Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Maosh */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Maosh</p>
                    <p className="text-xl font-bold text-green-700">{vacancy.oylik}</p>
                  </div>
                </div>
              </div>

              {/* Ish jadvali */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Ish jadvali</p>
                    <p className="text-xl font-bold text-blue-700">{vacancy.workScheduleId?.nom}</p>
                  </div>
                </div>
              </div>

              {/* Yosh */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Yosh</p>
                    <p className="text-xl font-bold text-purple-700">{vacancy.minAge} - {vacancy.maxAge} yosh</p>
                  </div>
                </div>
              </div>

              {/* Arizalar */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Arizalar</p>
                    <p className="text-xl font-bold text-orange-700">{vacancy.applicationCount} ta</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {vacancy.description && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tavsif</h3>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={formatHTML(vacancy.description)}
                />
              </div>
            )}

            {/* Responsibilities */}
            {vacancy.responsibilities && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Vazifalar</h3>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={formatHTML(vacancy.responsibilities)}
                />
              </div>
            )}

            {/* Preferences */}
            {vacancy.preferences && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Afzalliklar</h3>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={formatHTML(vacancy.preferences)}
                />
              </div>
            )}

            {/* Skills */}
            {vacancy.skills && vacancy.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ko'nikmalar</h3>
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
            <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Yaratilgan: {new Date(vacancy.createdAt).toLocaleDateString('uz-UZ')}</p>
              {vacancy.updatedAt !== vacancy.createdAt && (
                <p>Yangilangan: {new Date(vacancy.updatedAt).toLocaleDateString('uz-UZ')}</p>
              )}
            </div>
          </div>

          {/* Application Messages */}
          <AnimatePresence>
            {applicationSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-8 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-semibold">Ariza muvaffaqiyatli topshirildi!</p>
                </div>
              </motion.div>
            )}
            {applicationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-8 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 font-semibold">{applicationError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-4">
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Orqaga qaytish
                </button>
                {vacancy.status === 'active' && (
                  <button
                    onClick={handleOpenApplicationForm}
                    disabled={loadingForm || submitting || applicationSuccess}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      loadingForm || submitting || applicationSuccess
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loadingForm ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Yuklanmoqda...</span>
                      </>
                    ) : submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Yuborilmoqda...</span>
                      </>
                    ) : applicationSuccess ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Topshirildi</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Ariza topshirish</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Application Form Modal */}
      <ApplicationForm
        form={applicationForm}
        vacancyId={vacancy?._id}
        onSubmit={handleSubmitApplication}
        onClose={() => {
          setShowApplicationForm(false);
          setApplicationForm(null);
        }}
        isOpen={showApplicationForm}
      />
    </div>
  );
}

