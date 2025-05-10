"use client"

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import * as Views from "./views/containers"
import { PATHS } from "./constant"
import React from "react"

// Simple auth check for admin routes
const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminAuthenticated") === "true"
    setAuthenticated(isAdmin)
    setLoading(false)
  }, [])

  if (loading) {
    return React.createElement("div", null, "Loading...")
  }

  return authenticated
    ? children
    : React.createElement(Navigate, { to: PATHS.ADMIN_LOGIN.path })
}

export const AppRoutes = () =>
  React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      Routes,
      null,
      [
        React.createElement(Route, {
          key: "home",
          path: PATHS.HOMEPAGE.path,
          element: React.createElement(Views.Homepage),
        }),
        React.createElement(Route, {
          key: "calendar",
          path: PATHS.CALENDAR.path,
          element: React.createElement(Views.Calendar),
        }),
        React.createElement(Route, {
          key: "about",
          path: PATHS.ABOUT.path,
          element: React.createElement(Views.About),
        }),
        React.createElement(Route, {
          key: "contact",
          path: PATHS.CONTACT.path,
          element: React.createElement(Views.Contact),
        }),
        React.createElement(Route, {
          key: "register",
          path: PATHS.REGISTER.path,
          element: React.createElement(Views.Register),
        }),
        React.createElement(Route, {
          key: "recovery",
          path: PATHS.RECOVERY.path,
          element: React.createElement(Views.Recovery),
        }),
        React.createElement(Route, {
          key: "login",
          path: PATHS.LOGIN.path,
          element: React.createElement(Views.Login),
        }),
        React.createElement(Route, {
          key: "admin-login",
          path: PATHS.ADMIN_LOGIN.path,
          element: React.createElement(Views.AdminLogin),
        }),

        // Admin Routes
        React.createElement(Route, {
          key: "admin-dashboard",
          path: PATHS.ADMIN_DASHBOARD.path,
          element: React.createElement(AdminRoute, {
            children: React.createElement(Views.AdminDashboard),
          }),
        }),
        React.createElement(Route, {
          key: "admin-calendar",
          path: PATHS.ADMIN_CALENDAR.path,
          element: React.createElement(AdminRoute, {
            children: React.createElement(Views.AdminCalendar),
          }),
        }),
        React.createElement(Route, {
          key: "admin-rooms",
          path: PATHS.ADMIN_ROOMS.path,
          element: React.createElement(AdminRoute, {
            children: React.createElement(Views.AdminRooms),
          }),
        }),
        React.createElement(Route, {
          key: "admin-rooms-create",
          path: PATHS.ADMIN_ROOMS_CREATE.path,
          element: React.createElement(AdminRoute, {
            children: React.createElement(Views.AdminRoomsCreate),
          }),
        }),
        React.createElement(Route, {
          key: "admin-rooms-edit",
          path: PATHS.ADMIN_ROOMS_EDIT.path,
          element: React.createElement(AdminRoute, {
            children: React.createElement(Views.AdminRoomsEdit),
          }),
        }),
        React.createElement(Route, {
          key: "admin-users",
          path: PATHS.ADMIN_USERS.path,
          element: React.createElement(AdminRoute, {
            children: React.createElement(Views.AdminUsers),
          }),
        }),
        React.createElement(Route, {
          key: "admin-users-create",
          path: PATHS.ADMIN_USERS_CREATE.path,
          element: React.createElement(AdminRoute, {
            children: React.createElement(Views.AdminUsersCreate),
          }),
        }),
        React.createElement(Route, {
          key: "admin-users-edit",
          path: PATHS.ADMIN_USERS_EDIT.path,
          element: React.createElement(AdminRoute, {
            children: React.createElement(Views.AdminUsersEdit),
          }),
        }),

        React.createElement(Route, {
          key: "not-found",
          path: PATHS.NOT_FOUND.path,
          element: React.createElement(Views.NotFound),
        }),
      ]
    )
  )
