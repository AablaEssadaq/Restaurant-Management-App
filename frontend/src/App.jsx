
import { Routes,Route } from 'react-router-dom';
import LoginPage from './components/login-page';
import MultiStepForm from './components/multi-step-form'
import PostRegistrationPage from './components/post-registration'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.css';
import Dashboard from './components/dashboard';
import { Toaster } from './components/ui/toaster';


function App() {

  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<MultiStepForm />} />
      <Route path="/postRegister" element={<PostRegistrationPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    <Toaster />
    </>
  )
}

export default App
