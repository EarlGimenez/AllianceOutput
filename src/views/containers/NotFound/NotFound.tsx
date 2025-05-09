import type React from "react"
import { Box, Typography, Button, Container } from "@mui/material"
import { Link } from "react-router-dom"
import { PATHS } from "../../../constant"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"

const NotFound: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <LandingNav />

      <Container
        maxWidth="md"
        sx={{
          py: 12,
          textAlign: "center",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: { xs: "4rem", md: "6rem" }, fontWeight: "bold", color: "#1e5393" }}
        >
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mt: 2, mb: 4 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, maxWidth: "600px", mx: "auto" }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Box>
          <Button
            variant="contained"
            component={Link}
            to={PATHS.HOMEPAGE.path}
            sx={{
              mr: 2,
              bgcolor: "#1e5393",
              "&:hover": {
                bgcolor: "#184377",
              },
            }}
          >
            Go to Homepage
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#1e5393",
              borderColor: "#1e5393",
              "&:hover": {
                borderColor: "#184377",
              },
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Container>

      <SiteFooter />
    </Box>
  )
}

export default NotFound
