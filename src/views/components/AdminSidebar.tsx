"use client"

import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  AppBar,
  Badge,
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
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import PeopleIcon from "@mui/icons-material/People"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import LogoutIcon from "@mui/icons-material/Logout"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { PATHS } from "../../constant"

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
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null)

  const notifications = [
    { id: 1, message: "New user registered: Sarah Johnson", time: "15 min ago" },
    { id: 2, message: "Room 101 has been booked for tomorrow", time: "1 hour ago" },
    { id: 3, message: "System update scheduled for tonight", time: "3 hours ago" },
  ]

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
  const handleNotificationMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setNotificationAnchorEl(e.currentTarget)
  const handleNotificationMenuClose = () => setNotificationAnchorEl(null)

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: PATHS.ADMIN_DASHBOARD.path, active: location.pathname === PATHS.ADMIN_DASHBOARD.path },
    { text: "Calendar",  icon: <CalendarMonthIcon/>, path: PATHS.ADMIN_CALENDAR.path, active: location.pathname === PATHS.ADMIN_CALENDAR.path },
    { text: "Rooms",     icon: <MeetingRoomIcon/>, path: PATHS.ADMIN_ROOMS.path, active: location.pathname.startsWith("/admin/rooms") },
    { text: "Users",     icon: <PeopleIcon/>, path: PATHS.ADMIN_USERS.path, active: location.pathname.startsWith("/admin/users") },
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{ elevation: 3, sx: { minWidth: 300, maxWidth: 350 } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            px: 2, py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Notifications
          </Typography>
          <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
            Mark all as read
          </Typography>
        </Box>
        <Divider />
        {notifications.map(n => (
          <MenuItem key={n.id} onClick={handleNotificationMenuClose} sx={{ py: 1.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2">{n.message}</Typography>
              <Typography variant="caption" color="text.secondary">
                {n.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose} sx={{ justifyContent: "center" }}>
          <Typography variant="body2" color="primary">
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>

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
            top: ["48px", "56px", "64px"], // match AppBar height
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
            // ONLY push over when the drawer is open:
            ml: open ? `0px` : 0,
            // And shrink width accordingly (optional if using flexGrow):
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
