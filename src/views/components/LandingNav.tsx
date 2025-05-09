"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    { name: "Home", path: PATHS.HOMEPAGE.path },
    { name: "Resources", path: PATHS.ABOUT.path },
    { name: "Contact", path: PATHS.CONTACT.path },
    { name: "Sign In", path: PATHS.LOGIN.path },
    { name: "Register", path: PATHS.REGISTER.path },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Bookit
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemText>
              <Link
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: "#1e5393",
                  display: "block",
                  padding: "8px 16px",
                }}
              >
                {item.name}
              </Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1e5393", boxShadow: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
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
              aria-label="open drawer"
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
              to="/"
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
            {navItems.map((item) => (
              <Button key={item.name} component={Link} to={item.path} sx={{ color: "white", display: "block", mx: 1 }}>
                {item.name}
              </Button>
            ))}
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
