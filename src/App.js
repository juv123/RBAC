import './App.css';
import Login from './components/Login';
import ManageUsers from './components/ManageUsers'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserComponent from './components/UserComponent';
function App() {
  return (
    <div>
       <Router> {/* Ensure the Router wraps your routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<ManageUsers />} />
        <Route path="/register" element={<UserComponent />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </div>
  )
}
export default App;
