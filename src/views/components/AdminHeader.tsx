"use client"

import React from "react"
import { Box, Typography, IconButton, Badge, Menu, MenuItem, Divider, useTheme, useMediaQuery } from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../../constant"

interface AdminHeaderProps {
  title: string
  subtitle?: string
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    navigate(PATHS.ADMIN_LOGIN.path)
  }

  const notifications = [
    { id: 1, message: "New user registered: Sarah Johnson", time: "15 min ago" },
    { id: 2, message: "Room 101 has been booked for tomorrow", time: "1 hour ago" },
    { id: 3, message: "System update scheduled for tonight", time: "3 hours ago" },
  ]

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="large" color="inherit" onClick={handleNotificationMenuOpen} sx={{ mr: 1 }}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 300, maxWidth: 350 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            Notifications
          </Typography>
          <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
            Mark all as read
          </Typography>
        </Box>
        <Divider />
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationMenuClose} sx={{ py: 1.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2">{notification.message}</Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
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
    </Box>
  )
}
