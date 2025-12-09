import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SnackbarProvider } from './contexts/SnackbarContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Snackbar from './components/Snackbar/Snackbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admins from './pages/Admins'
import Departments from './pages/Departments'
import Positions from './pages/Positions'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Vacancies from './pages/Vacancies'
import Candidates from './pages/Candidates'
import Interviews from './pages/Interviews'
import Results from './pages/Results'
import Referrals from './pages/Referrals'
import ScheduleTemplates from './pages/ScheduleTemplates'
import EmployeeSchedules from './pages/EmployeeSchedules'
import FAQ from './pages/Help/FAQ'
import Questions from './pages/Help/Questions'
import Documentation from './pages/Help/Documentation'
import NoPage from './pages/NoPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider>
          <Snackbar />
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="admins" element={<Admins />} />
                  <Route path="departments" element={<Departments />} />
                  <Route path="positions" element={<Positions />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="vacancies" element={<Vacancies />} />
                  <Route path="candidates" element={<Candidates />} />
                  <Route path="interviews" element={<Interviews />} />
                  <Route path="results" element={<Results />} />
                  <Route path="referrals" element={<Referrals />} />
                  <Route path="schedule-templates" element={<ScheduleTemplates />} />
                  <Route path="employee-schedules" element={<EmployeeSchedules />} />
                  <Route path="help">
              <Route path="faq" element={<FAQ />} />
              <Route path="questions" element={<Questions />} />
              <Route path="documentation" element={<Documentation />} />
            </Route>
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
