import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App' 
import Dashboard from './pages/Dashboard' 
import Login from './pages/Login' 
import QuizInterface from './pages/QuizInterface' 
import 'katex/dist/katex.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<App />} />
        
        {/* Authentication Section 4.0 */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected User Dashboard Section 5.2 */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Quiz Interface Section 4.3 - Dynamic ID for different sessions */}
        <Route path="/quiz/:id" element={<QuizInterface />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)