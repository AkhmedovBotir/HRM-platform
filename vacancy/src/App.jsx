import { Routes, Route } from 'react-router-dom';
import VacancyList from './pages/VacancyList';
import VacancyDetail from './pages/VacancyDetail';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VacancyList />} />
      <Route path="/vacancy/:id" element={<VacancyDetail />} />
    </Routes>
  );
}
