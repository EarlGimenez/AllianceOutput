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
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"
import { PATHS } from "../../../constant"

const SignUp: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <LandingNav />

      <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Create an Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Join Bookit to start managing your meetings efficiently.
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I agree to the Terms of Service and Privacy Policy."
                />
              </Grid>
            </Grid>

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
              Sign Up
            </Button>

            {/* <Divider sx={{ my: 3 }}>
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
            </Grid> */}

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link to={PATHS.LOGIN.path} style={{ textDecoration: "none", color: "#1e5393", fontWeight: "bold" }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      <SiteFooter />
    </Box>
  )
}

export default SignUp
