import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ResetPassword from './pages/reset-password';
import UpdatePassword from './pages/update-password';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </Router>
  );
}
