"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { PATHS } from "../../constant"

export const LandingNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("userAuthenticated") === "true"

  const navItems = [
    { name: "Home", path: isAuthenticated ? PATHS.USER_PROFILE.path : PATHS.HOMEPAGE.path },
    { name: "Calendar", path: PATHS.CALENDAR.path },
    { name: "Resources", path: PATHS.ABOUT.path },
    { name: "Contact", path: PATHS.CONTACT.path },
  ]

  const guestNavItems = [
    { name: "Sign In", path: PATHS.LOGIN.path, background: "#184377" },
    { name: "Register", path: PATHS.REGISTER.path, background: "#184377" },
  ]

  const userNavItems = [
    { 
      name: "Profile", 
      path: PATHS.USER_PROFILE.path, 
      icon: "https://via.placeholder.com/150", // Placeholder image
      isImage: true
    },
    { 
      name: "Logout", 
      action: () => { 
        localStorage.removeItem("userAuthenticated")
        window.location.reload() // Optionally reload the page after logout
      },
      color: "red",
    },
  ]

  // Admin should not appear if logged in
  const adminNavItem = { name: "Admin", path: PATHS.ADMIN_LOGIN.path }

  const fullNavItems = [
    ...navItems,
    ...(isAuthenticated ? userNavItems : guestNavItems),
    ...(isAuthenticated ? [] : [adminNavItem]), // Exclude Admin if logged in
  ]

  const isActive = (path: string) => location.pathname === path

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Bookit
      </Typography>
      <List>
        {fullNavItems.map((item) =>
          "action" in item ? (
            <ListItem key={item.name} disablePadding>
              <ListItemText>
                <Button
                  onClick={item.action}
                  sx={{
                    textTransform: "none",
                    width: "100%",
                    color: item.color || "#1e5393",
                    textAlign: "left",
                    padding: "8px 16px",
                  }}
                >
                  {item.name}
                </Button>
              </ListItemText>
            </ListItem>
          ) : (
            <ListItem key={item.name} disablePadding>
              <ListItemText>
                <Link
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    color: isActive(item.path) ? "#ffffff" : "#1e5393",
                    display: "block",
                    padding: "8px 16px",
                    backgroundColor: isActive(item.path) ? "#1e5393" : "transparent",
                  }}
                >
                  {item.name}
                </Link>
              </ListItemText>
            </ListItem>
          )
        )}
      </List>
    </Box>
  )

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1e5393", boxShadow: 0, height: "auto" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: "64px", py: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to={isAuthenticated ? PATHS.USER_PROFILE.path : PATHS.HOMEPAGE.path} // Adjusted Home path based on authentication
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Bookit
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              to={isAuthenticated ? PATHS.USER_PROFILE.path : PATHS.HOMEPAGE.path} // Adjusted Home path for mobile as well
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                alignItems: "center",
              }}
            >
              Bookit
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "flex-end" }}>
            {fullNavItems.map((item) =>
              "action" in item ? (
                <Button
                  key={item.name}
                  onClick={item.action}
                  sx={{
                    color: "white",
                    mx: 1,
                    backgroundColor: item.color ? item.color : "transparent",
                    "&:hover": {
                      backgroundColor: item.color ? "#ff4747" : "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ) : (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: "white",
                    mx: 1,
                    backgroundColor: isActive(item.path) ? "rgba(255, 255, 255, 0.2)" : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    ...(item.name === "Sign In" || item.name === "Register"
                      ? {
                          backgroundColor: "#184377", // Contrast background color for Sign In/Up
                          "&:hover": {
                            backgroundColor: "#184377", // Maintain contrast
                          },
                        }
                      : {}),
                  }}
                >
                  {item.name}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  )
}
