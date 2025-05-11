"use client";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  Alert, 
  Divider, 
  useTheme 
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { LandingNav } from "../../../components/LandingNav";
import { SiteFooter } from "../../../components/SiteFooter";
import { PATHS } from "../../../../constant";

const AdminLogin: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || PATHS.ADMIN_DASHBOARD.path;
  
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    if (formData.email.includes("admin")) {
      setTimeout(() => {
        localStorage.setItem("adminAuthenticated", "true");
        navigate(from, { replace: true });
      }, 1000);
    } else {
      setError("Invalid admin credentials");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <LandingNav />

      <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 60, color: "#1e5393", mb: 2 }} />
            <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
              Admin Login
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Enter your admin credentials to access the dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Admin Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
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
              {loading ? "Logging in..." : "Login as Admin"}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Not an admin?{" "}
                <Link to={PATHS.LOGIN.path} style={{ textDecoration: "none", color: "#1e5393", fontWeight: "bold" }}>
                  Regular Login
                </Link>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: "rgba(30, 83, 147, 0.1)", borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Development Mode
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For testing, use any email containing "admin" (e.g., admin@example.com) with any password.
            </Typography>
          </Box>
        </Paper>
      </Container>

      <SiteFooter />
    </Box>
  );
};

export default AdminLogin;