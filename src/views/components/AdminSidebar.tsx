"use client"

import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import PeopleIcon from "@mui/icons-material/People"
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import LogoutIcon from "@mui/icons-material/Logout"
import { PATHS } from "../../constant"
import { NotificationBadge } from "./NotificationBadge"

const drawerWidth = 240

interface AdminSidebarProps {
  children?: React.ReactNode
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ children }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [open, setOpen] = useState(!isMobile)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    setIsAdmin(adminAuthenticated)
    if (!adminAuthenticated) navigate(PATHS.ADMIN_LOGIN.path)
  }, [navigate])

  const handleDrawerToggle = () => setOpen(o => !o)
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    navigate(PATHS.ADMIN_LOGIN.path)
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: PATHS.ADMIN_DASHBOARD.path, active: location.pathname === PATHS.ADMIN_DASHBOARD.path },
    { text: "Calendar",  icon: <CalendarMonthIcon/>, path: PATHS.ADMIN_CALENDAR.path, active: location.pathname === PATHS.ADMIN_CALENDAR.path },
    { text: "Rooms",     icon: <MeetingRoomIcon/>, path: PATHS.ADMIN_ROOMS.path, active: location.pathname.startsWith("/admin/rooms") },
    { text: "Users",     icon: <PeopleIcon/>, path: PATHS.ADMIN_USERS.path, active: location.pathname.startsWith("/admin/users") },
    { text: "Notifications", icon: <NotificationsActiveIcon/>, path: PATHS.ADMIN_NOTIFICATIONS.path, active: location.pathname === PATHS.ADMIN_NOTIFICATIONS.path },
  ]

  if (!isAdmin) return null

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "#1e5393",
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap>
              Bookit Admin
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Dynamic Notification Badge */}
            <NotificationBadge />
            
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: ["48px", "56px", "64px"],
          },
        }}
      >
        
        <Divider />
        <List>
          {menuItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={item.active}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "rgba(30, 83, 147, 0.1)",
                    borderLeft: "4px solid #1e5393",
                    "&:hover": { bgcolor: "rgba(30, 83, 147, 0.2)" },
                  },
                  "&:hover": { bgcolor: "rgba(30, 83, 147, 0.05)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.active ? "#1e5393" : "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: item.active ? "medium" : "normal",
                    color: item.active ? "#1e5393" : "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            p: 3,
            mt: ["48px","56px","64px"],
            ml: open ? `0px` : 0,
            width: open
            ? `calc(100% - ${drawerWidth}px)`
            : "100vw",
            transition: theme.transitions.create(["margin","width"],{
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
