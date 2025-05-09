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

const AdminRoomsCreate: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    timeStart: "08:00",
    timeEnd: "18:00",
  })
  const [errors, setErrors] = useState({
    name: "",
    location: "",
    timeStart: "",
    timeEnd: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required"
      valid = false
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
      valid = false
    }

    if (!formData.timeStart) {
      newErrors.timeStart = "Start time is required"
      valid = false
    }

    if (!formData.timeEnd) {
      newErrors.timeEnd = "End time is required"
      valid = false
    }

    // Check if end time is after start time
    if (formData.timeStart && formData.timeEnd && formData.timeStart >= formData.timeEnd) {
      newErrors.timeEnd = "End time must be after start time"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

// … inside AdminRoomsCreate …

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setSubmitSuccess(true);
      setTimeout(() => navigate(PATHS.ADMIN_ROOMS.path), 1500);
    } catch (err) {
      console.error("Create room failed:", err);
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
            <MuiLink component={Link} to={PATHS.ADMIN_ROOMS.path} color="inherit">
              Rooms
            </MuiLink>
            <Typography color="text.primary">Create Room</Typography>
          </Breadcrumbs>

          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Room created successfully! Redirecting...
            </Alert>
          )}

          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Room Details
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    name="name"
                    label="Room Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="location"
                    name="location"
                    label="Location"
                    value={formData.location}
                    onChange={handleChange}
                    error={!!errors.location}
                    helperText={errors.location}
                    placeholder="e.g., 1st Floor, East Wing"
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="timeStart"
                    name="timeStart"
                    label="Available From"
                    type="time"
                    value={formData.timeStart}
                    onChange={handleChange}
                    error={!!errors.timeStart}
                    helperText={errors.timeStart}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="timeEnd"
                    name="timeEnd"
                    label="Available Until"
                    type="time"
                    value={formData.timeEnd}
                    onChange={handleChange}
                    error={!!errors.timeEnd}
                    helperText={errors.timeEnd}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <Button
                      component={Link}
                      to={PATHS.ADMIN_ROOMS.path}
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
                      {isSubmitting ? "Creating..." : "Create Room"}
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

export default AdminRoomsCreate
