
import { Routes,Route } from 'react-router-dom';
import LoginPage from './pages/login-page';
import MultiStepForm from './pages/multi-step-form'
import PostRegistrationPage from './pages/post-registration'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.css';
import Dashboard from './components/my components/Dashboard';
import { Toaster } from './components/ui/toaster';
import Layout from './components/my components/Layout';
import { UserProvider } from './context/UserContext';
import { RestaurantProvider } from './context/RestaurantContext';
import SuppliersList from './components/my components/SuppliersList';
import SuppliersOrders from './components/my components/SuppliersOrders';



function App() {

  return (
    <>
    <UserProvider>
    <RestaurantProvider>
    <Routes>
      <Route path="/register" element={<MultiStepForm />} />
      <Route path="/postRegister" element={<PostRegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/suppliers/list" element={<SuppliersList />} />
        <Route path="/suppliers/orders" element={<SuppliersOrders />} />
      </Route>
    </Routes>
    <Toaster />
    </RestaurantProvider>
    </UserProvider>
    </>
  )
}

export default App
