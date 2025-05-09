"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  Alert,
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { AdminSidebar } from "../../../../components/AdminSidebar"
import { AdminHeader } from "../../../../components/AdminHeader"
import { PATHS } from "../../../../../constant"

const AdminUsersCreate: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    company: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    fullName: "",
    company: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user types
    setErrors({
      ...errors,
      [name]: "",
    })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
      valid = false
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
      valid = false
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
      valid = false
    }

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = "Company is required"
      valid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      valid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          fullName: formData.fullName,
          company: formData.company,
          password: formData.password,
          // any other fields...
        }),
      });
  
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
  
      setSubmitSuccess(true);
      setTimeout(() => navigate(PATHS.ADMIN_USERS.path), 1500);
    } catch (err) {
      console.error("Failed to create user:", err);
      // optionally show an error alert
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminSidebar>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={Link} to={PATHS.ADMIN_DASHBOARD.path} color="inherit">
              Dashboard
            </MuiLink>
            <MuiLink component={Link} to={PATHS.ADMIN_USERS.path} color="inherit">
              Users
            </MuiLink>
            <Typography color="text.primary">Create User</Typography>
          </Breadcrumbs>

          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              User created successfully! Redirecting...
            </Alert>
          )}

          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    User Details
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="company"
                    name="company"
                    label="Company"
                    value={formData.company}
                    onChange={handleChange}
                    error={!!errors.company}
                    helperText={errors.company}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Security
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <Button
                      component={Link}
                      to={PATHS.ADMIN_USERS.path}
                      variant="outlined"
                      sx={{
                        color: "#1e5393",
                        borderColor: "#1e5393",
                        "&:hover": {
                          borderColor: "#184377",
                        },
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        bgcolor: "#1e5393",
                        "&:hover": {
                          bgcolor: "#184377",
                        },
                      }}
                    >
                      {isSubmitting ? "Creating..." : "Create User"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Box>
    </AdminSidebar>
  )
}

export default AdminUsersCreate
