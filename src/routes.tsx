"use client"

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import * as Views from "./views/containers"
import { PATHS } from "./constant"

// Simple auth check for admin routes
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is authenticated
    const isAdmin = localStorage.getItem("adminAuthenticated") === "true"
    setAuthenticated(isAdmin)
    setLoading(false)
  }, [])

  if (loading) {
    // You could add a loading spinner here
    return <div>Loading...</div>
  }

  return authenticated ? children : <Navigate to={PATHS.ADMIN_LOGIN.path} />
}

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={PATHS.HOMEPAGE.path} element={<Views.Homepage />} />
        <Route path={PATHS.CALENDAR.path} element={<Views.Calendar />} />
        <Route path={PATHS.ABOUT.path} element={<Views.About />} />
        <Route path={PATHS.CONTACT.path} element={<Views.Contact />} />
        <Route path={PATHS.REGISTER.path} element={<Views.Register />} />
        <Route path={PATHS.RECOVERY.path} element={<Views.Recovery />} />
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.ADMIN_LOGIN.path} element={<Views.AdminLogin />} />

        {/* Dashboard Routes */}
        {/* <Route path={PATHS.USER_DASHBOARD.path} element={<Views.Dashboard />} />
        <Route path={PATHS.USER_DAYVIEW.path} element={<Views.DashboardCalendar />} />
        <Route path={PATHS.USER_RESERVATION.path} element={<Views.DashboardSettings />} /> */}

        {/* Admin Routes */}
        <Route
          path={PATHS.ADMIN_DASHBOARD.path}
          element={
            <AdminRoute>
              <Views.AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN_CALENDAR.path}
          element={
            <AdminRoute>
              <Views.AdminCalendar />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN_ROOMS.path}
          element={
            <AdminRoute>
              <Views.AdminRooms />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN_ROOMS_CREATE.path}
          element={
            <AdminRoute>
              <Views.AdminRoomsCreate />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN_ROOMS_EDIT.path}
          element={
            <AdminRoute>
              <Views.AdminRoomsEdit />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN_USERS.path}
          element={
            <AdminRoute>
              <Views.AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN_USERS_CREATE.path}
          element={
            <AdminRoute>
              <Views.AdminUsersCreate />
            </AdminRoute>
          }
        />
        <Route
          path={PATHS.ADMIN_USERS_EDIT.path}
          element={
            <AdminRoute>
              <Views.AdminUsersEdit />
            </AdminRoute>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
