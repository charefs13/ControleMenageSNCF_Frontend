import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ResetPassword from './pages/reset-password';
import UpdatePassword from './pages/update-password';
import MainPage from './pages/mainPage';
import AddAuthorization from './pages/addAuthorization';
import Logout from './pages/logout';
import ManageAuthorization from "./pages/manageAuthorization";
import Statistics from './pages/statistics';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path='/mainPage' element={<MainPage />} />
        <Route path='/addAuthorization' element={<AddAuthorization />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/manageAuthorization" element={<ManageAuthorization />} />
        <Route path="/statistics" element={<Statistics />} />

      </Routes>
    </Router>
  );
}
