import type React from "react"
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"

const Resources: React.FC = () => {
  // FAQ data
  const faqs = [
    {
      question: "How do I book a meeting room?",
      answer:
        "You can book a meeting room by logging into your account, navigating to the dashboard, selecting the desired date and time, and choosing an available room. You can also set recurring meetings and invite participants.",
    },
    {
      question: "Can I cancel or reschedule a booking?",
      answer:
        "Yes, you can cancel or reschedule a booking up to 1 hour before the scheduled time without any penalty. Simply go to your dashboard, find the booking, and select the cancel or reschedule option.",
    },
    {
      question: "How far in advance can I book a room?",
      answer:
        "Regular users can book rooms up to 2 weeks in advance. Premium users can book up to 2 months in advance. This helps ensure fair access to meeting spaces for all team members.",
    },
    {
      question: "Is there a limit to how long I can book a room?",
      answer:
        "Standard bookings can be made for up to 4 hours at a time. For longer sessions or special events, please contact the admin team who can make extended reservations.",
    },
    {
      question: "Can I book multiple rooms at once?",
      answer:
        "Yes, you can book multiple rooms simultaneously if you need to organize larger events or parallel sessions. Simply select the 'Multiple Room Booking' option in the booking interface.",
    },
    {
      question: "How do I report issues with a meeting room?",
      answer:
        "If you encounter any issues with a meeting room (technical problems, cleanliness, etc.), you can report it through the 'Report Issue' button in your booking details or contact support directly.",
    },
  ]

  // Resource articles
  const articles = [
    {
      title: "Effective Meeting Management",
      description: "Learn how to plan, conduct, and follow up on meetings to maximize productivity and engagement.",
      image: "/placeholder.svg",
    },
    {
      title: "Room Setup Best Practices",
      description:
        "Discover the optimal room configurations for different types of meetings and collaborative sessions.",
      image: "/placeholder.svg",
    },
    {
      title: "Virtual Meeting Integration",
      description: "Tips for seamlessly integrating virtual participants into your in-person meetings.",
      image: "/placeholder.svg",
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
            Resources & Support
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: "normal" }}>
            Everything you need to get the most out of Bookit
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
            Why Choose Bookit
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: "100%" }}>
                <Box
                  component="img"
                  src="/placeholder.svg"
                  alt="Bookit Features"
                  sx={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 3,
                  }}
                />
                <Typography variant="h5" gutterBottom>
                  Streamlined Booking Process
                </Typography>
                <Typography variant="body1" paragraph>
                  Our intuitive interface makes booking meeting rooms quick and hassle-free. Check availability in
                  real-time, reserve spaces with just a few clicks, and manage all your bookings from a centralized
                  dashboard.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <List>
                {[
                  "Real-time availability checking",
                  "Calendar integration with Google, Outlook, and Apple",
                  "Automated notifications and reminders",
                  "Room equipment and capacity filters",
                  "Mobile-friendly interface for on-the-go booking",
                  "Detailed analytics and usage reports",
                ].map((feature, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon sx={{ color: "#1e5393" }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#1e5393",
                  "&:hover": {
                    bgcolor: "#184377",
                  },
                }}
              >
                Learn More About Features
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Resource Articles */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
            Helpful Resources
          </Typography>

          <Grid container spacing={4}>
            {articles.map((article, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia component="img" height="200" image={article.image} alt={article.title} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {article.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button size="small" sx={{ color: "#1e5393" }}>
                      Read More
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* FAQ Section */}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body1" paragraph>
              Can't find what you're looking for?
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1e5393",
                "&:hover": {
                  bgcolor: "#184377",
                },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Box>
      </Container>

      <SiteFooter />
    </Box>
  )
}

export default Resources
