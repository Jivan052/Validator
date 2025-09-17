import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import NewIdea from './pages/NewIdea'
import IdeaDetails from './pages/IdeaDetails'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Navigate to="/login" />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/new" 
              element={
                <PrivateRoute>
                  <NewIdea />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/idea/:ideaId" 
              element={
                <PrivateRoute>
                  <IdeaDetails />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
