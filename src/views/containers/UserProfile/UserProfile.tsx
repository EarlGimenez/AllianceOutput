"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Avatar,
  Switch,
  FormControlLabel,
  IconButton,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
import ViewListIcon from "@mui/icons-material/ViewList"
import TableViewIcon from "@mui/icons-material/TableView"
import EventIcon from "@mui/icons-material/Event"
import { LandingNav } from "../../components/LandingNav"
import { SiteFooter } from "../../components/SiteFooter"
import BookingForm from "../../components/BookingForm"
import { createBooking, updateBooking, deleteBooking } from "../../services/bookingService"
import { CalendarEvent, Room } from '../../components/CalendarEvents';


interface Booking {
  id: string
  room: string
  startTime: string
  endTime: string
  location: string
  date: Date
  color: string
}

interface CalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onAddEvent?: (newEvent: Partial<CalendarEvent>) => Promise<void>;
  onEditEvent?: (updatedEvent: CalendarEvent) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `booking-tab-${index}`,
    "aria-controls": `booking-tabpanel-${index}`,
  }
}

export const UserProfile: React.FC = () => {
  const [showAllBookings, setShowAllBookings] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4)) // May 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 5)) // May 5, 2025
  const [tabValue, setTabValue] = useState(0)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined)
  const [formDate, setFormDate] = useState<Date | undefined>(new Date())
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
   const username = localStorage.getItem('user.name') || 'John Doe';
  const email = localStorage.getItem('user.email') || 'john.doe@example.com';
  const avatarInitial = username.charAt(0).toUpperCase();

   const rooms: Room[] = [
      'Meeting Room',
      'School Classroom',
      'Professional Studio',
      'Science Lab',
      'Coworking Space',
    ];

  // Sample bookings data
  const [bookings, setBookings] = useState<Booking[]>([
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
  ])

  const handleOpenBookingForm = (eventToEdit?: CalendarEvent, dateForNew?: Date) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit)
      setFormDate(eventToEdit.date ? new Date(eventToEdit.date + 'T00:00:00') : undefined)
    } else {
      setEditingEvent(undefined)
      setFormDate(dateForNew || new Date())
    }
    setIsBookingFormOpen(true)
  }

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false)
    setEditingEvent(undefined)
  }

  const handleBookingSubmit = async (bookingData: Partial<CalendarEvent>) => {
    try {
      const adjustToLocalDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0]
      }

      const bookingDate = bookingData.date 
        ? adjustToLocalDate(bookingData.date)
        : adjustToLocalDate(new Date().toISOString())

      if (bookingData.id) {
        // Update existing booking
        const updatedBooking = await updateBooking(bookingData.id, {
          ...bookingData,
          date: bookingDate
        })
        // Update your bookings state here
        console.log('Booking updated:', updatedBooking)
      } else {
        // Create new booking
        const newBooking = await createBooking({
          ...bookingData,
          date: bookingDate,
          userId: localStorage.getItem('userId') || ''
        } as Omit<CalendarEvent, 'id'>)
        
        // Add to your bookings state here
        console.log('Booking created:', newBooking)
      }
      handleCloseBookingForm()
    } catch (error) {
      console.error('Error saving booking:', error)
      alert('Failed to save booking')
    }
  }

  const handleRequestDelete = (eventId: string) => {
    setEventToDeleteId(eventId)
    setDeleteConfirmOpen(true)
    if (editingEvent?.id === eventId) {
      handleCloseBookingForm()
    }
  }

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false)
    setEventToDeleteId(null)
  }

  const handleConfirmDelete = async () => {
    if (!eventToDeleteId) return
    
    try {
      await deleteBooking(eventToDeleteId)
      // Remove from your bookings state here
      console.log('Booking deleted:', eventToDeleteId)
      handleCloseDeleteConfirm()
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Failed to delete booking')
    }
  }

  // Filter bookings for the selected date or all if showAllBookings is true
  const filteredBookings = showAllBookings
    ? bookings
    : bookings.filter((booking) => booking.date.toDateString() === selectedDate.toDateString())

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

  // Format date for table display
  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Handle booking actions
  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
    setEditDialogOpen(true)
  }

  const handleCancel = (booking: Booking) => {
    setSelectedBooking(booking)
    setCancelDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
    setSelectedBooking(null)
  }

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false)
    setSelectedBooking(null)
  }

  const handleSaveEdit = () => {
    // In a real app, you would update the booking in your database
    console.log(`Saving edits for booking ${selectedBooking?.id}`)
    setEditDialogOpen(false)
    setSelectedBooking(null)
  }

  const handleConfirmCancel = () => {
    if (selectedBooking) {
      // In a real app, you would delete the booking from your database
      setBookings(bookings.filter((booking) => booking.id !== selectedBooking.id))
      console.log(`Cancelling booking ${selectedBooking.id}`)
      setCancelDialogOpen(false)
      setSelectedBooking(null)
    }
  }

  const getColorForBooking = (color: string) => {
    switch (color) {
      case "primary":
        return "#1e88e5" // blue
      case "secondary":
        return "#9c27b0" // purple
      case "success":
        return "#4caf50" // green
      default:
        return "#1e88e5" // default blue
    }
  }

  const getBackgroundColorForBooking = (color: string) => {
    switch (color) {
      case "primary":
        return "#bbdefb" // light blue
      case "secondary":
        return "#e1bee7" // light purple
      case "success":
        return "#c8e6c9" // light green
      default:
        return "#bbdefb" // default light blue
    }
  }

  // Generate time slots for the calendar view
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8 // Start at 8 AM
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
  })

  // Find bookings for a specific time slot
  const getBookingsForTimeSlot = (timeSlot: string) => {
    return filteredBookings.filter((booking) => {
      const startHour = Number.parseInt(booking.startTime.split(":")[0])
      const startPeriod = booking.startTime.includes("PM") ? "PM" : "AM"
      const slotHour = Number.parseInt(timeSlot.split(":")[0])
      const slotPeriod = timeSlot.includes("PM") ? "PM" : "AM"

      return startHour === slotHour && startPeriod === slotPeriod
    })
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#fff" }}>
      <LandingNav />

      {/* Main layout with sidebar and content */}
      <Box component="main" sx={{ flexGrow: 1, display: "flex", height: "calc(100vh - 64px)" }}>
        {/* Left sidebar */}
        <Box
          sx={{
            width: 300,
            borderRight: "1px solid #eee",
            height: "100%",
            overflow: "auto",
            p: 3,
            display: { xs: "none", md: "block" },
          }}
        >
           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: '#ccc' }} alt={username}>
        {avatarInitial}
      </Avatar>
      <Typography variant="h5" component="h2" gutterBottom>
        {username}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {email}
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
                const hasBooking = bookings.some((booking) => booking.date.toDateString() === day.date.toDateString())

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
              onClick={() => navigate("/user-settings")}
              sx={{
                borderColor: "#1e5393",
                color: "#1e5393",
                "&:hover": {
                  borderColor: "#1e5393",
                  backgroundColor: "rgba(30, 83, 147, 0.04)",
                },
              }}
            >
              User Settings
            </Button>
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, p: 3, overflow: "auto", height: "100%" }}>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
              My Bookings
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenBookingForm()}
              sx={{
                backgroundColor: "#1e5393",
                "&:hover": {
                  backgroundColor: "#164279",
                },
              }}
            >
              Create Booking
            </Button>
          </Box>

          <Box sx={{ p: 2, mb: 3, border: "1px solid #eee", borderRadius: 1 }}>
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
          </Box>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="booking view tabs"
                sx={{
                  "& .MuiTab-root": { color: "#1e5393", textTransform: "uppercase", fontWeight: 500 },
                  "& .Mui-selected": { color: "#1e5393" },
                  "& .MuiTabs-indicator": { backgroundColor: "#1e5393" },
                }}
              >
                <Tab icon={<ViewListIcon sx={{ mr: 1 }} />} label="List View" {...a11yProps(0)} />
                <Tab icon={<TableViewIcon sx={{ mr: 1 }} />} label="Table View" {...a11yProps(1)} />
                <Tab icon={<EventIcon sx={{ mr: 1 }} />} label="Calendar View" {...a11yProps(2)} />
              </Tabs>
            </Box>

            {/* List View */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">My Bookings</Typography>
                </Box>

                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <Box
                      key={booking.id}
                      sx={{
                        mb: 2,
                        p: 3,
                        borderRadius: 1,
                        border: "1px solid #eee",
                        "&:hover": {
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        },
                      }}
                    >
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
                          {showAllBookings && (
                            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                              <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary">
                                {formatShortDate(booking.date)}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEdit(booking)}
                            sx={{
                              mr: 1,
                              borderColor: "#1e5393",
                              color: "#1e5393",
                              "&:hover": {
                                borderColor: "#1e5393",
                                backgroundColor: "rgba(30, 83, 147, 0.04)",
                              },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleCancel(booking)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
                    No bookings found for the selected date.
                  </Typography>
                )}
              </Box>
            </TabPanel>

            {/* Table View */}
            <TabPanel value={tabValue} index={1}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="bookings table">
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>Room</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor: getColorForBooking(booking.color),
                                  mr: 1,
                                }}
                              />
                              {booking.room}
                            </Box>
                          </TableCell>
                          <TableCell>{formatShortDate(booking.date)}</TableCell>
                          <TableCell>{`${booking.startTime} - ${booking.endTime}`}</TableCell>
                          <TableCell>{booking.location}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => handleEdit(booking)}
                              sx={{
                                mr: 1,
                                borderColor: "#1e5393",
                                color: "#1e5393",
                                "&:hover": {
                                  borderColor: "#1e5393",
                                  backgroundColor: "rgba(30, 83, 147, 0.04)",
                                },
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleCancel(booking)}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                          No bookings found for the selected date.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Calendar View */}
            <TabPanel value={tabValue} index={2}>
              <Paper sx={{ p: 2, mb: 3, border: "1px solid #eee", boxShadow: "none" }}>
                <Grid container>
                  <Grid item xs={2} sx={{ borderRight: "1px solid #eee", backgroundColor: "#f5f5f5" }}>
                    <Typography variant="subtitle2" sx={{ p: 1, textAlign: "center", fontWeight: "bold" }}>
                      Time
                    </Typography>
                    {timeSlots.map((slot, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 1,
                          height: 80,
                          borderTop: "1px solid #eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2">{slot}</Typography>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={10}>
                    <Typography
                      variant="subtitle2"
                      sx={{ p: 1, textAlign: "center", fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      {formatShortDate(selectedDate)}
                    </Typography>
                    {timeSlots.map((slot, index) => {
                      const slotBookings = getBookingsForTimeSlot(slot)
                      return (
                        <Box
                          key={index}
                          sx={{
                            p: 1,
                            height: 80,
                            borderTop: "1px solid #eee",
                            borderLeft: "1px solid #eee",
                            position: "relative",
                          }}
                        >
                          {slotBookings.length > 0
                            ? slotBookings.map((booking) => (
                                <Paper
                                  key={booking.id}
                                  sx={{
                                    p: 1,
                                    backgroundColor: getBackgroundColorForBooking(booking.color),
                                    color: getColorForBooking(booking.color),
                                    height: "90%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    position: "relative",
                                    overflow: "hidden",
                                    boxShadow: "none",
                                    border: `1px solid ${getColorForBooking(booking.color)}`,
                                  }}
                                >
                                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {booking.room}
                                  </Typography>
                                  <Typography variant="caption">
                                    {booking.startTime} - {booking.endTime}
                                  </Typography>
                                  <Box sx={{ position: "absolute", right: 4, top: 4 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEdit(booking)}
                                      sx={{ p: 0.5, mr: 0.5 }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleCancel(booking)} sx={{ p: 0.5 }}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Paper>
                              ))
                            : null}
                        </Box>
                      )
                    })}
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>
          </Box>
        </Box>
      </Box>

      {/* Edit Booking Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              margin="dense"
              id="room"
              label="Room"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedBooking?.room}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  id="date"
                  label="Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  defaultValue={selectedBooking?.date.toISOString().split("T")[0]}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="color-label">Color</InputLabel>
                  <Select labelId="color-label" id="color" defaultValue={selectedBooking?.color} label="Color">
                    <MenuItem value="primary">Blue</MenuItem>
                    <MenuItem value="secondary">Purple</MenuItem>
                    <MenuItem value="success">Green</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  id="startTime"
                  label="Start Time"
                  type="text"
                  fullWidth
                  variant="outlined"
                  defaultValue={selectedBooking?.startTime}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  id="endTime"
                  label="End Time"
                  type="text"
                  fullWidth
                  variant="outlined"
                  defaultValue={selectedBooking?.endTime}
                />
              </Grid>
            </Grid>
            <TextField
              margin="dense"
              id="location"
              label="Location"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedBooking?.location}
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              backgroundColor: "#1e5393",
              "&:hover": {
                backgroundColor: "#164279",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your booking for {selectedBooking?.room} on{" "}
            {selectedBooking?.date.toLocaleDateString()} at {selectedBooking?.startTime}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>No, Keep It</Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking Form Dialog */}
      <Dialog open={isBookingFormOpen} onClose={handleCloseBookingForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>{editingEvent?.id ? 'Edit Booking' : 'Create Booking'}</DialogTitle>
        <DialogContent>
          <BookingForm
            rooms={rooms}
            onSubmit={handleBookingSubmit}
            onCancel={handleCloseBookingForm}
            initialData={editingEvent}
            currentDate={formDate}
            onDelete={handleRequestDelete}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to cancel this reservation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <SiteFooter />
    </Box>
  )
}

export default UserProfile