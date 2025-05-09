import type React from "react"
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
import GoogleIcon from "@mui/icons-material/Google"
import FacebookIcon from "@mui/icons-material/Facebook"
import AppleIcon from "@mui/icons-material/Apple"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"
import { PATHS } from "../../../constant"

const SignIn: React.FC = () => {
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

          <Box component="form" noValidate sx={{ mt: 1 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
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
              Sign In
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={{ py: 1 }}>
                  Google
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button fullWidth variant="outlined" startIcon={<FacebookIcon />} sx={{ py: 1 }}>
                  Facebook
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button fullWidth variant="outlined" startIcon={<AppleIcon />} sx={{ py: 1 }}>
                  Apple
                </Button>
              </Grid>
            </Grid>

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
