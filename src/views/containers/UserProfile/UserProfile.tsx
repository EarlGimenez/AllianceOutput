"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Switch,
  FormControlLabel,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PersonIcon from "@mui/icons-material/Person"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import AddIcon from "@mui/icons-material/Add"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"

interface Booking {
  id: string
  room: string
  startTime: string
  endTime: string
  location: string
  date: Date
  color: string
}

export const UserProfile: React.FC = () => {
  const [showAllBookings, setShowAllBookings] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4)) // May 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 5)) // May 5, 2025
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()

  // Sample bookings data
  const bookings: Booking[] = [
    {
      id: "1",
      room: "Conference Room A",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      location: "Building 3, Floor 2",
      date: new Date(2025, 4, 5),
      color: "primary",
    },
    {
      id: "2",
      room: "Meeting Room B",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      location: "Building 2, Floor 1",
      date: new Date(2025, 4, 5),
      color: "success",
    },
    {
      id: "3",
      room: "Auditorium",
      startTime: "4:30 PM",
      endTime: "6:00 PM",
      location: "Main Building",
      date: new Date(2025, 4, 5),
      color: "secondary",
    },
  ]

  // Filter bookings for the selected date
  const filteredBookings = bookings.filter((booking) => booking.date.toDateString() === selectedDate.toDateString())

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysInMonth = lastDay.getDate()
    const days = []

    // Add days from previous month to fill first week
    const firstDayOfWeek = firstDay.getDay()

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        dayOfMonth: i,
        isCurrentMonth: true,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Get day of week abbreviations
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  // Handle previous and next month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle booking actions
  const handleEdit = (id: string) => {
    console.log(`Editing booking ${id}`)
  }

  const handleCancel = (id: string) => {
    console.log(`Cancelling booking ${id}`)
  }

  const getColorForBooking = (color: string) => {
    switch (color) {
      case "primary":
        return theme.palette.primary.main
      case "secondary":
        return theme.palette.secondary.main
      case "success":
        return theme.palette.success.main
      default:
        return theme.palette.primary.main
    }
  }

  const getBackgroundColorForBooking = (color: string) => {
    switch (color) {
      case "primary":
        return theme.palette.primary.light
      case "secondary":
        return theme.palette.secondary.light
      case "success":
        return theme.palette.success.light
      default:
        return theme.palette.primary.light
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <LandingNav />

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Left sidebar */}
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{ width: 120, height: 120, mb: 2 }}
                      alt="John Doe"
                      src="/placeholder.svg?height=120&width=120"
                    />
                    <Typography variant="h5" component="h2" gutterBottom>
                      John Doe
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      john.doe@example.com
                    </Typography>
                  </Box>

                  <Typography variant="h6" component="h3" gutterBottom>
                    Upcoming Bookings
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <IconButton size="small" onClick={goToPreviousMonth}>
                        <ChevronLeftIcon />
                      </IconButton>
                      <Typography variant="subtitle1">
                        {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </Typography>
                      <IconButton size="small" onClick={goToNextMonth}>
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={1}>
                      {weekdays.map((day) => (
                        <Grid item key={day} xs={12 / 7}>
                          <Typography variant="caption" align="center" sx={{ display: "block", fontWeight: "medium" }}>
                            {day}
                          </Typography>
                        </Grid>
                      ))}

                      {calendarDays.map((day, index) => {
                        const isSelected = day.date.toDateString() === selectedDate.toDateString()
                        const hasBooking = bookings.some(
                          (booking) => booking.date.toDateString() === day.date.toDateString(),
                        )

                        return (
                          <Grid item key={index} xs={12 / 7}>
                            <Box
                              onClick={() => setSelectedDate(day.date)}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: 32,
                                width: "100%",
                                borderRadius: "50%",
                                cursor: "pointer",
                                backgroundColor: isSelected ? "#1e5393" : "transparent",
                                color: isSelected ? "white" : hasBooking ? "#1e5393" : "inherit",
                                "&:hover": {
                                  backgroundColor: isSelected ? "#1e5393" : "rgba(0, 0, 0, 0.04)",
                                },
                              }}
                            >
                              <Typography variant="body2">{day.dayOfMonth}</Typography>
                            </Box>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PersonIcon />}
                      onClick={() => console.log("Edit profile")}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Main content */}
            <Grid item xs={12} md={9}>
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" component="h1">
                  My Bookings
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => console.log("Create booking")}
                  sx={{ backgroundColor: "#1e5393" }}
                >
                  Create Booking
                </Button>
              </Box>

              <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6">{formatDate(selectedDate)}</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showAllBookings}
                        onChange={(e) => setShowAllBookings(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show all bookings"
                  />
                </Box>
              </Paper>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">My Bookings</Typography>
                </Box>

                {filteredBookings.map((booking) => (
                  <Card key={booking.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            mr: 2,
                            backgroundColor: getBackgroundColorForBooking(booking.color),
                          }}
                        >
                          <CalendarMonthIcon sx={{ color: getColorForBooking(booking.color) }} />
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h3">
                            {booking.room}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {booking.startTime} - {booking.endTime}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {booking.location}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEdit(booking.id)}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleCancel(booking.id)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <SiteFooter />
    </Box>
  )
}

export default UserProfile