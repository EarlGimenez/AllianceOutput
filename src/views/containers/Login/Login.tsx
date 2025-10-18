import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material"
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"
import { PATHS } from "../../../constant"
import { login } from "../../services/authService";


const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login({ email, password });

      // Set authentication state
      localStorage.setItem("userAuthenticated", "true"); 
      localStorage.setItem("userId", user.userId); // Changed from user.userID to user.userId
      localStorage.setItem("user.firstName", user.firstName);
      localStorage.setItem('user.name', user.username);
      localStorage.setItem('user.email', user.email);
      localStorage.setItem('user.lastName', user.lastName);

      // Redirect to user profile
      navigate(PATHS.USER_PROFILE.path);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <LandingNav />

      <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Sign In
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Welcome back! Please enter your details.
          </Typography>
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}


          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
              <Link to={PATHS.RECOVERY.path} style={{ textDecoration: "none", color: "#1e5393" }}>
                <Typography variant="body2">Forgot password?</Typography>
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                bgcolor: "#1e5393",
                "&:hover": {
                  bgcolor: "#184377",
                },
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link to={PATHS.REGISTER.path} style={{ textDecoration: "none", color: "#1e5393", fontWeight: "bold" }}>
                  Sign up
                </Link>
              </Typography>
            </Box>

            {/* Admin Login Link */}
            <Box sx={{ textAlign: "center", mt: 3, pt: 3, borderTop: "1px dashed rgba(0,0,0,0.1)" }}>
              <Button
                component={Link}
                to={PATHS.ADMIN_LOGIN.path}
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ color: "#1e5393" }}
              >
                Admin Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <SiteFooter />
    </Box>
  )
}

export default SignIn
