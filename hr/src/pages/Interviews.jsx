import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import { useSnackbar } from '../contexts/SnackbarContext'
import InterviewDetailModal from '../components/Interviews/InterviewDetailModal'

function Interviews() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Monday as first day
    return new Date(today.setDate(diff))
  })
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInterview, setSelectedInterview] = useState(null)
  const { showError } = useSnackbar()

  const STATUS_FILTERS = [
    { value: 'all', label: 'Barcha' },
    { value: 'in_process', label: 'Jarayonda' },
    { value: 'completed', label: 'Yakunlangan' },
    { value: 'cancelled', label: 'Bekor qilingan' },
  ]

  useEffect(() => {
    fetchInterviews()
  }, [currentWeekStart, statusFilter])

  const fetchInterviews = async () => {
    setLoading(true)
    const weekStart = new Date(currentWeekStart)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // 7 days (Monday to Sunday)

    const filters = {
      interviewDateFrom: weekStart.toISOString(),
      interviewDateTo: weekEnd.toISOString(),
    }

    if (statusFilter !== 'all') {
      filters.status = statusFilter
    }

    const result = await apiService.getInterviews(filters)

    if (result.success) {
      const normalizedInterviews = (result.data.interviews || []).map((interview) => ({
        ...interview,
        id: interview.id || interview._id,
        vacancyName: interview.vacancyId?.nom || 'Noma\'lum vakansiya',
        candidateName: getCandidateName(interview),
      }))
      setInterviews(normalizedInterviews)
    } else {
      showError(result.error || 'Intervyularni yuklashda xatolik')
    }
    setLoading(false)
  }

  const getCandidateName = (interview) => {
    if (!interview.applicationSubmissionId?.answers) return 'Noma\'lum nomzod'
    
    // Ism va familiyani topish
    const nameAnswer = interview.applicationSubmissionId.answers.find(
      (ans) => ans.question && (ans.question.toLowerCase().includes('ism') || ans.question.toLowerCase().includes('familiya'))
    )
    
    if (nameAnswer) {
      return nameAnswer.answer || 'Noma\'lum nomzod'
    }
    
    // Agar topilmasa, birinchi javobni olish
    if (interview.applicationSubmissionId.answers.length > 0) {
      return interview.applicationSubmissionId.answers[0].answer || 'Noma\'lum nomzod'
    }
    
    return 'Noma\'lum nomzod'
  }

  const getWeekDays = () => {
    const weekStart = new Date(currentWeekStart)
    const days = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      days.push({
        date: date,
        dateStr: dateStr,
        dayName: date.toLocaleDateString('uz-UZ', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('uz-UZ', { month: 'short' }),
      })
    }
    return days
  }

  const getCurrentStage = (interview) => {
    if (!interview.stages || interview.stages.length === 0) return null
    return interview.stages.find(s => s.stageOrder === interview.currentStage) || interview.stages[interview.stages.length - 1]
  }

  const getInterviewsForDate = (dateStr) => {
    return interviews.filter((interview) => {
      const currentStage = getCurrentStage(interview)
      if (!currentStage?.interviewDate) return false
      const interviewDate = new Date(currentStage.interviewDate).toISOString().split('T')[0]
      return interviewDate === dateStr
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_process': return 'bg-purple-100 text-purple-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_process': return 'Jarayonda'
      case 'completed': return 'Yakunlangan'
      case 'cancelled': return 'Bekor qilingan'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}${timeString ? ` ${timeString}` : ''}`
  }

  const navigateWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + (direction * 7))
    setCurrentWeekStart(newWeekStart)
  }

  const goToCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const weekStart = new Date(today.setDate(diff))
    setCurrentWeekStart(weekStart)
  }

  const getWeekRange = () => {
    const weekStart = new Date(currentWeekStart)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return `${formatDate(weekStart.toISOString())} - ${formatDate(weekEnd.toISOString())}`
  }

  const days = getWeekDays()
  const uniqueCandidates = [...new Set(interviews.map((i) => i.candidateName))]

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">Intervyular</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Intervyular boshqaruvi</h1>
            <p className="text-gray-500 mt-2">Nomzodlar bilan intervyu jadvalini kuzatib boring</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-blue-600 text-white shadow shadow-blue-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek(-1)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {getWeekRange()}
            </h2>
            <button
              onClick={goToCurrentWeek}
              className="text-sm text-blue-600 hover:text-blue-700 mt-1"
            >
              Joriy haftaga o'tish
            </button>
          </div>
          <button
            onClick={() => navigateWeek(1)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-200 p-1.5 md:p-2 text-left text-[10px] md:text-xs font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 min-w-[120px] md:min-w-[150px]">
                      Nomzod / Sana
                    </th>
                    {days.map((day) => (
                    <th
                      key={day.dateStr}
                      className="border border-gray-200 p-1 md:p-1.5 text-center text-[10px] font-semibold text-gray-700 bg-gray-50 min-w-[70px] md:min-w-[90px]"
                    >
                      <div className="font-semibold">{day.dayNumber}</div>
                      <div className="text-gray-400 text-[9px] mt-0.5">{day.dayName}</div>
                    </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uniqueCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={days.length + 1} className="text-center py-12 text-gray-500">
                        Intervyular topilmadi
                      </td>
                    </tr>
                  ) : (
                    uniqueCandidates.map((candidateName) => {
                      const candidateInterviews = interviews.filter((i) => i.candidateName === candidateName)
                      const vacancyName = candidateInterviews[0]?.vacancyName || 'Noma\'lum'

                      return (
                        <tr key={candidateName} className="hover:bg-gray-50">
                          <td className="border border-gray-200 p-1.5 md:p-2 bg-white sticky left-0 z-10 shadow-sm">
                            <div className="font-medium text-gray-900 text-[10px] md:text-xs">{candidateName}</div>
                            <div className="text-[9px] text-gray-500 mt-0.5 line-clamp-1">{vacancyName}</div>
                          </td>
                          {days.map((day) => {
                            const dayInterviews = getInterviewsForDate(day.dateStr).filter(
                              (i) => i.candidateName === candidateName
                            )

                            return ( 
                              <td key={day.dateStr} className="border border-gray-200 p-0.5 md:p-1 text-center">
                                {dayInterviews.length > 0 ? (
                                  <div className="space-y-0.5">
                                    {dayInterviews.map((interview) => (
                                      <div
                                        key={interview.id}
                                        onClick={() => setSelectedInterview(interview)}
                                        className={`px-1 py-0.5 rounded text-[9px] md:text-[10px] font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(interview.status)}`}
                                        title={`${getCurrentStage(interview)?.interviewTime || ''} - ${getCurrentStage(interview)?.location || ''}`}
                                      >
                                        <div className="font-semibold whitespace-nowrap">{getCurrentStage(interview)?.interviewTime || '—'}</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-gray-300 text-[10px]">—</div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onUpdate={fetchInterviews}
        />
      )}
    </div>
  )
}

export default Interviews

