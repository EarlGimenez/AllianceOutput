// AdminRoomsEdit.tsx (Updated)
"use client";

import React, { useState, useEffect, ChangeEvent, useRef } from "react";
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
  Input,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AdminSidebar } from "../../../../components/AdminSidebar";
import { PATHS } from "../../../../../constant";

const AdminRoomsEdit: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    timeStart: "",
    timeEnd: "",
    purpose: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    location: "",
    timeStart: "",
    timeEnd: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/rooms/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Room not found");
        const room = await res.json();
        setFormData({
          name: room.name,
          location: room.location,
          timeStart: room.timeStart,
          timeEnd: room.timeEnd,
          purpose: room.purpose,
          image: room.image,
        });
      })
      .catch(() => navigate(PATHS.ADMIN_ROOMS.path))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required";
      valid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
      valid = false;
    }

    if (!formData.timeStart) {
      newErrors.timeStart = "Start time is required";
      valid = false;
    }

    if (!formData.timeEnd) {
      newErrors.timeEnd = "End time is required";
      valid = false;
    }

    if (formData.timeStart && formData.timeEnd && formData.timeStart >= formData.timeEnd) {
      newErrors.timeEnd = "End time must be after start time";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

// AdminRoomsEdit.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);
  let imagePath = formData.image; 

  if (imageFile) {
    const formDataToSend = new FormData(); 
    formDataToSend.append('image', imageFile);

    try {
      const uploadRes = await fetch('http://localhost:3002/api/rooms/upload-image', {
        method: 'POST',
        body: formDataToSend,
      });
      if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
      ({ imagePath } = await uploadRes.json());
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      return;
    }
  }
 
  const updatedRoom = {
    ...formData,
    image: imagePath, 
  };

  try {
    const updateRes = await fetch(`http://localhost:3001/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRoom),
    });
    if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.status}`);
    setSubmitSuccess(true);
    setTimeout(() => navigate(PATHS.ADMIN_ROOMS.path), 1500);
  } catch (err) {
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) {
    return (
      <AdminSidebar>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <CircularProgress />
        </Box>
      </AdminSidebar>
    );
  }

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
            <Typography color="text.primary">Edit Room</Typography>
          </Breadcrumbs>

          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Room updated successfully! Redirecting...
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
                    id="purpose"
                    name="purpose"
                    label="Purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Input type="file" inputProps={{ accept: "image/*" }} onChange={handleImageChange} />
                  {formData.image && <img src={formData.image} alt="Preview" style={{ maxWidth: 100, maxHeight: 100 }} />}
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
                    InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
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
                        "&:hover": { borderColor: "#184377" },
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
                        "&:hover": { bgcolor: "#184377" },
                      }}
                    >
                      {isSubmitting ? "Updating..." : "Update Room"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Box>
    </AdminSidebar>
  );
};

export default AdminRoomsEdit;
