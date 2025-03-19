import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/protected/ProtectedRoute';
import DriverLayout from './features/driver/layouts/DriverLayout';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboards
import UserDashboard from './features/user/pages/Dashboard';
import DriverDashboard from './features/driver/pages/Dashboard';
import AdminDashboard from './features/admin/pages/Dashboard';

import UserProfile from './features/user/pages/Profile';
import DriverProfile from './features/driver/pages/Profile';
import ManageTrips from './features/driver/pages/Trips';
import ManageUsers from './features/admin/pages/Users';
import Settings from './features/admin/pages/Settings';
import Bookings from './features/driver/pages/Bookings';
import Statistics from './features/driver/pages/Statistics';
import Profile from './features/driver/pages/Profile';
import TripDetails from './features/user/components/trip-details';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques avec MainLayout */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Routes utilisateur avec MainLayout */}
        <Route path="user/*" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Routes>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="trips/:id" element={<TripDetails />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Routes conducteur avec DriverLayout (sans MainLayout) */}
        <Route
          path="driver/*"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverLayout>
                <Routes>
                  <Route path="dashboard" element={<DriverDashboard />} />
                  <Route path="trips" element={<ManageTrips />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="stats" element={<Statistics />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                </Routes>
              </DriverLayout>
            </ProtectedRoute>
          }
        />

        {/* Routes admin avec son propre layout (à créer) */}
        <Route path="admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
