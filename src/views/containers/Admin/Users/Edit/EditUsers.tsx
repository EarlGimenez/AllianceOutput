"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import bcrypt from "bcryptjs";
import { AdminSidebar } from "../../../../components/AdminSidebar";
import { PATHS } from "../../../../../constant";

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  company: string;
  password: string;
}

const AdminUsersEdit: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<User | null>(null);
  const [initialPassword, setInitialPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

// EditUsers.tsx (continued from part 1)

useEffect(() => {
  if (id) {
    setLoading(true);
    fetch(`http://localhost:3001/users/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("User not found");
          }
          return res.json();
        })
        .then((user: User) => {
          setFormData(user);
          setInitialPassword(user.password);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    let newErrors = { ...errors };

    if (!formData) return false;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
      isValid = false;
    }

    if (passwordChanged) {
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, errors, passwordChanged]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      let hashedPassword = formData.password;
      if (passwordChanged) {
        hashedPassword = await bcrypt.hash(formData.password, 10);
      }

      const res = await fetch(`http://localhost:3001/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, password: hashedPassword }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update user");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate(PATHS.ADMIN_USERS.path);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error updating user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setPasswordChanged(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
            <Typography color="text.primary">Edit User</Typography>
          </Breadcrumbs>

          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              User updated successfully! Redirecting...
            </Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}

          {formData ? (
            <Paper sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="username"
                      label="Username"
                      value={formData.username}
                      onChange={handleChange}
                      error={Boolean(errors.username)}
                      helperText={errors.username}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="firstName"
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={Boolean(errors.lastName)}
                      helperText={errors.lastName}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="company"
                      label="Company"
                      value={formData.company}
                      onChange={handleChange}
                      error={Boolean(errors.company)}
                      helperText={errors.company}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Change Password
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Leave blank to keep the current password.
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="password"
                      label="New Password"
                      type="password"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : "Save"}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(PATHS.ADMIN_USERS.path)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Box>
    </AdminSidebar>
  );
};

export default AdminUsersEdit;
