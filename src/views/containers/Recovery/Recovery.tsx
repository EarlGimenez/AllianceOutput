"use client"

import React from "react"
import { Link } from "react-router-dom"
import { Box, Typography, TextField, Button, Paper, Container, Alert } from "@mui/material"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"
import { PATHS } from "../../../constant"

const AccountRecovery: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <LandingNav />

      <Container component="main" maxWidth="sm" sx={{ py: 8, flexGrow: 1, display: "flex", alignItems: "center" }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Account Recovery
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {submitted ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Alert severity="success" sx={{ mb: 3, fontSize: "1rem" }}>
                Recovery email sent!
              </Alert>
              <Typography variant="h6" paragraph sx={{ fontWeight: "medium", color: "#1e5393" }}>
                Please check your inbox
              </Typography>
              <Typography variant="body1" paragraph>
                We've sent a password reset link to your email address. Please check your inbox and follow the
                instructions to reset your password.
              </Typography>
              <Typography variant="body2" paragraph sx={{ mb: 4 }}>
                If you don't receive the email within a few minutes, please check your spam folder.
              </Typography>
              <Button
                component={Link}
                to={PATHS.LOGIN.path}
                variant="contained"
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  bgcolor: "#1e5393",
                  "&:hover": {
                    bgcolor: "#184377",
                  },
                }}
              >
                Return to Sign In
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  bgcolor: "#1e5393",
                  "&:hover": {
                    bgcolor: "#184377",
                  },
                }}
              >
                Send Recovery Email
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Remember your password?{" "}
                  <Link to={PATHS.LOGIN.path} style={{ textDecoration: "none", color: "#1e5393", fontWeight: "bold" }}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>

      <SiteFooter />
    </Box>
  )
}

export default AccountRecovery
