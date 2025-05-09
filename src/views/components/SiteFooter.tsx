"use client"

import type React from "react"
import { Link } from "react-router-dom"
import {
  Box,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import { PATHS } from "../../constant"

export const SiteFooter: React.FC = () => {
  const theme = useTheme()

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: PATHS.ABOUT.path },
        { name: "Contact", path: PATHS.CONTACT.path },
        { name: "Careers", path: "#" },
        { name: "Blog", path: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", path: "#" },
        { name: "Privacy Policy", path: "#" },
        { name: "Terms of Service", path: "#" },
        { name: "FAQ", path: "#" },
      ],
    },
    {
      title: "Features",
      links: [
        { name: "Room Booking", path: "#" },
        { name: "Calendar Integration", path: "#" },
        { name: "Team Management", path: "#" },
        { name: "Analytics", path: "#" },
      ],
    },
  ]

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f0f4f9",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Bookit
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The ultimate meeting room reservation platform for modern businesses. Streamline your scheduling and
              maximize your workspace efficiency.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook" sx={{ color: "#1e5393" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="twitter" sx={{ color: "#1e5393" }}>
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="instagram" sx={{ color: "#1e5393" }}>
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="linkedin" sx={{ color: "#1e5393" }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {footerLinks.map((section) => (
            <Grid item xs={12} sm={4} md={2.5} key={section.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {section.title}
              </Typography>
              <List dense>
                {section.links.map((link) => (
                  <ListItem key={link.name} disablePadding>
                    <ListItemText>
                      <Link
                        to={link.path}
                        style={{
                          textDecoration: "none",
                          color: "#1e5393",
                          fontSize: "0.875rem",
                        }}
                      >
                        {link.name}
                      </Link>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mt: 4, mb: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Bookit. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for better meetings
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
