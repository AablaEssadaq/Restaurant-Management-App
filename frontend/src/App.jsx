import '@fortawesome/fontawesome-free/css/all.css';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './components/my components/Dashboard';
import Layout from './components/my components/Layout';
import SuppliersList from './components/my components/SuppliersList';
import SuppliersOrders from './components/my components/orders/SuppliersOrders';
import { Toaster } from './components/ui/toaster';
import { setNavigationCallback } from './config/api';
import { RestaurantProvider } from './context/RestaurantContext';
import { UserProvider } from './context/UserContext';
import './index.css';
import LoginPage from './pages/login-page';
import MultiStepForm from './pages/multi-step-form';
import PostRegistrationPage from './pages/post-registration';
import SessionExpired from './pages/session-expired';
import Unauthorized from './pages/unauthorized';
import PrivateRoute from './components/my components/PrivateRoute';
import Logistics from './components/my components/logistics/Logistics';
import SubCategories from './components/my components/logistics/SubCategories';
import LogisticsItems from './components/my components/logistics/LogisticsItems';
import Managers from './components/my components/Managers';

function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    setNavigationCallback(navigate);
  }, [navigate]);

  return (
    <>
      <UserProvider>
        <RestaurantProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={<MultiStepForm />} />
            <Route path="/postRegister" element={<PostRegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/suppliers/list" element={<SuppliersList />} />
              <Route path="/suppliers/orders" element={<SuppliersOrders />} />
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/logistics/subcategories" element={<SubCategories/>} />
              <Route path="/logistics/equipements" element={<LogisticsItems/>} />
              <Route path="/managers" element={<Managers/>} />
            </Route>
          </Routes>
          <Toaster />
        </RestaurantProvider>
      </UserProvider>
    </>
  );
}

export default App;