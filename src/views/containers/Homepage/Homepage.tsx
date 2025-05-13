"use client"

import type React from "react"
import { Link } from "react-router-dom"
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"
import { PATHS } from "../../../constant"

const Homepage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Testimonial data
  const testimonials = [
    {
      quote:
        "Bookit has completely transformed how we schedule meetings. The interface is intuitive and the booking process is seamless.",
      name: "Sarah Johnson",
      title: "Marketing Director",
    },
    {
      quote:
        "I've tried many scheduling tools, but Bookit stands out with its reliability and feature set. Highly recommended!",
      name: "Michael Chen",
      title: "Product Manager",
    },
    {
      quote:
        "The ability to check room availability in real-time has saved us countless hours of back-and-forth emails.",
      name: "Emily Rodriguez",
      title: "HR Specialist",
    },
    {
      quote: "Our team productivity increased by 30% after implementing Bookit for our meeting management.",
      name: "David Kim",
      title: "Operations Lead",
    },
    {
      quote:
        "The calendar integration works flawlessly with our existing systems. Couldn't be happier with this platform.",
      name: "Jessica Taylor",
      title: "IT Director",
    },
    {
      quote: "Customer support is exceptional. Any questions we had were answered promptly and thoroughly.",
      name: "Robert Wilson",
      title: "CEO",
    },
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <LandingNav />

<Box sx={{ height: "66px", width: "100%", position: "relative" }}>
  <Box
    component="img"
    src="https://t4.ftcdn.net/jpg/00/80/91/11/360_F_80911186_RoBCsyLrNTrG7Y1EOyCsaCJO5DyHgTox.jpg"
    alt="Top banner"
    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      bgcolor: "rgba(0,0,0,0.4", // dark tint
    }}
  />
</Box>


      {/* Main banner - 524px tall */}
      <Box
        sx={{
          height: "524px",
          width: "100%",
          bgcolor: "#1e5393",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h2" component="h1" sx={{ mb: 3, fontWeight: "bold" }}>
          Bookit
        </Typography>
        <Typography variant="h5" sx={{ mb: 5, maxWidth: "600px" }}>
          Your Meeting Reservation Platform
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            component={Link}
            to={PATHS.LOGIN.path}
            sx={{
              bgcolor: "#f0f4f9",
              color: "#1e5393",
              "&:hover": {
                bgcolor: "#e1eaf3",
              },
              px: 4,
              py: 1.5,
            }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            component={Link}
            to={PATHS.REGISTER.path}
            sx={{
              bgcolor: "#f0f4f9",
              color: "#1e5393",
              "&:hover": {
                bgcolor: "#e1eaf3",
              },
              px: 4,
              py: 1.5,
            }}
          >
            Register
          </Button>
        </Box>
      </Box>

      {/* Middle image banner - 240px tall */}
<Box sx={{ height: "240px", width: "100%", position: "relative" }}>
  <Box
    component="img"
    src="https://t4.ftcdn.net/jpg/00/80/91/11/360_F_80911186_RoBCsyLrNTrG7Y1EOyCsaCJO5DyHgTox.jpg"
    alt="Middle banner"
    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      bgcolor: "rgba(0,0,0,0.4)", // same dark tint
    }}
  />
</Box>


      {/* Testimonials section */}
      <Box sx={{ py: 8, bgcolor: "#1e5393", color: "white", width: "100%" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: "bold" }}>
              What Our Users Say
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: "800px", mx: "auto" }}>
              Find the perfect meeting room anytime, anywhere. Check availability, book instantly, and make your
              meetings memorable—effortless scheduling at your fingertips!
            </Typography>
          </Box>

          {/* Testimonial cards - 3x2 grid */}
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 3 }}>
                  <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", pb: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: "italic",
                        mb: 2,
                        flexGrow: 1,
                      }}
                    >
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "auto", pt: 1 }}>
                      <Avatar sx={{ bgcolor: "grey.300", width: 40, height: 40, flexShrink: 0 }}>
                        <PersonIcon sx={{ color: "grey.600" }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.title}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <SiteFooter />
    </Box>
  )
}

export default Homepage
