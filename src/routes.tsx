"use client";
import React from "react";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  Outlet,
  useLocation 
} from "react-router-dom";
import * as Views from "./views/containers";
import { PATHS } from "./constant";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [auth, setAuth] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const authenticated = localStorage.getItem("adminAuthenticated") === "true";
    setAuth(authenticated);
  }, []);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return auth ? (
    <>{children}</>
  ) : (
    <Navigate
      to={PATHS.ADMIN_LOGIN.path}
      state={{ from: location.pathname }}
      replace
    />
  );
};

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route index element={<Views.Homepage />} />
      <Route path={PATHS.HOMEPAGE.path} element={<Views.Homepage />} />
      <Route path={PATHS.CALENDAR.path} element={<Views.Calendar />} />
      <Route path={PATHS.ABOUT.path} element={<Views.About />} />
      <Route path={PATHS.CONTACT.path} element={<Views.Contact />} />
      <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
      <Route path={PATHS.REGISTER.path} element={<Views.Register />} />
      <Route path={PATHS.RECOVERY.path} element={<Views.Recovery />} />
      <Route path={PATHS.USER_SETTINGS.path} element={<Views.Settings />} />

      {/* Admin login (public) */}
      <Route path={PATHS.ADMIN_LOGIN.path} element={<Views.AdminLogin />} />

      {/* Protected admin routes */}
      <Route path="/admin" element={<AdminRoute><Outlet /></AdminRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Views.AdminDashboard />} />
        <Route path="calendar" element={<Views.AdminCalendar />} />
        
        <Route path="rooms">
          <Route index element={<Views.AdminRooms />} />
          <Route path="create" element={<Views.AdminRoomsCreate />} />
          <Route path=":id/edit" element={<Views.AdminRoomsEdit />} />
        </Route>

        <Route path="users">
          <Route index element={<Views.AdminUsers />} />
          <Route path="create" element={<Views.AdminUsersCreate />} />
          <Route path=":id/edit" element={<Views.AdminUsersEdit />} />
        </Route>

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Views.NotFound />} />
    </Routes>
  </BrowserRouter>
);