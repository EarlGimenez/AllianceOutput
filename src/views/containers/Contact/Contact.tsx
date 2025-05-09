"use client"

import React from "react"
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"
import { PageBanner } from "../../components/PageBanner"

const Contact: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    setSubmitted(false)
  }

  const contactInfo = [
    {
      icon: <LocationOnIcon fontSize="large" sx={{ color: "#1e5393" }} />,
      title: "Our Office",
      details: ["123 Booking Street", "Suite 456", "San Francisco, CA 94103"],
    },
    {
      icon: <PhoneIcon fontSize="large" sx={{ color: "#1e5393" }} />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "Monday-Friday: 9am-6pm", "Saturday: 10am-4pm"],
    },
    {
      icon: <EmailIcon fontSize="large" sx={{ color: "#1e5393" }} />,
      title: "Email",
      details: ["support@bookit.com", "sales@bookit.com", "careers@bookit.com"],
    },
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <LandingNav />

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#1e5393",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: "normal" }}>
            We'd love to hear from you. Get in touch with our team.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField required fullWidth id="name" label="Your Name" name="name" autoComplete="name" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth id="subject" select label="Subject" defaultValue="General Inquiry">
                      <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                      <MenuItem value="Technical Support">Technical Support</MenuItem>
                      <MenuItem value="Billing Question">Billing Question</MenuItem>
                      <MenuItem value="Feature Request">Feature Request</MenuItem>
                      <MenuItem value="Partnership">Partnership</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required fullWidth id="message" label="Your Message" name="message" multiline rows={6} />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    bgcolor: "#1e5393",
                    "&:hover": {
                      bgcolor: "#184377",
                    },
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box sx={{ height: "100%" }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Have questions or need assistance? Reach out to us through any of these channels.
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {contactInfo.map((info, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          {info.icon}
                          <Typography variant="h6" sx={{ ml: 2 }}>
                            {info.title}
                          </Typography>
                        </Box>
                        <Box sx={{ pl: 6 }}>
                          {info.details.map((detail, idx) => (
                            <Typography key={idx} variant="body2" paragraph sx={{ mb: 0.5 }}>
                              {detail}
                            </Typography>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Business Hours
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Monday-Friday:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">9:00 AM - 6:00 PM</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Saturday:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">10:00 AM - 4:00 PM</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Sunday:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Closed</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Banner Image */}
      <PageBanner
        imageSrc="https://t4.ftcdn.net/jpg/00/80/91/11/360_F_80911186_RoBCsyLrNTrG7Y1EOyCsaCJO5DyHgTox.jpg"
        imageAlt="Contact Banner"
        header="Bookit"
        subheader="Your Meeting Reservation Partner"
        overlayColor="rgba(0,0,0,0.4)"
      />

      {/* Banner before footer */}
      <Box
        sx={{
          bgcolor: "#f0f4f9",
          py: 6,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: "#1e5393", fontWeight: "bold" }}>
            Ready to simplify your meeting management?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Join thousands of satisfied users who have transformed their scheduling experience with Bookit.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              bgcolor: "#1e5393",
              "&:hover": {
                bgcolor: "#184377",
              },
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>

      <Snackbar open={submitted} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Your message has been sent! We'll get back to you soon.
        </Alert>
      </Snackbar>

      <SiteFooter />
    </Box>
  )
}

export default Contact
