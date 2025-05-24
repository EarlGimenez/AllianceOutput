"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material"
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay"
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth"
import ChevronLeft from "@mui/icons-material/ChevronLeft"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { AdminSidebar } from "../../../components/AdminSidebar"
import BookingForm from "../../../components/BookingForm"
import { CalendarEvent } from "../../../components/CalendarEvents"
import { getBookings, createBooking, updateBooking, deleteBooking } from "../../../services/bookingService"
import { getRooms } from "../../../services/roomService"
import { Room } from "../../../services/roomService"

type DayCell =
  | { type: "dayName"; value: string }
  | { type: "empty" }
  | {
      type: "day"
      value: number
      date: Date
      bookings: CalendarEvent[]
    }

const ROOMS_PER_PAGE = 5;

const AdminCalendar: React.FC = () => {
  const theme = useTheme()
  const [view, setView] = useState<"day" | "month">("day")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<CalendarEvent[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedBooking, setSelectedBooking] = useState<CalendarEvent | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, roomsData] = await Promise.all([
          getBookings(),
          getRooms()
        ])
        setBookings(bookingsData)
        setRooms(roomsData)
        setTotalPages(Math.ceil(roomsData.length / ROOMS_PER_PAGE))
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [currentDate])

  useEffect(() => {
    setCurrentPage(0)
    setTotalPages(Math.ceil(rooms.length / ROOMS_PER_PAGE))
  }, [rooms])

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: "day" | "month" | null) => {
    if (newView !== null) {
      setView(newView)
    }
  }

  const handlePrevDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
  }

  const formatDate = (date: Date, viewType: "day" | "month" = view) => {
    if (viewType === "day") {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    }
  }

  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
  })

  const generateMonthDays = (): DayCell[][] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const days: DayCell[][] = []

    days.push(dayNames.map((day) => ({ type: "dayName", value: day })) as DayCell[])

    let week: DayCell[] = []
    for (let i = 0; i < firstDay; i++) {
      week.push({ type: "empty" })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date)
        return (
          bookingDate.getDate() === date.getDate() &&
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getFullYear() === date.getFullYear()
        )
      })
      week.push({
        type: "day",
        value: day,
        date,
        bookings: dayBookings
      })

      if (week.length === 7) {
        days.push(week)
        week = []
      }
    }

    while (week.length < 7) {
      week.push({ type: "empty" })
    }

    days.push(week)

    return days
  }

  const monthDays = generateMonthDays()

  const handleBookingClick = (booking: CalendarEvent) => {
    setSelectedBooking(booking)
    setIsFormOpen(true)
  }

  const handleBookingSubmit = async (bookingData: Partial<CalendarEvent>) => {
    try {
      if (bookingData.id) {
        const updatedBooking = await updateBooking(bookingData.id, bookingData)
        setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
      } else {
        const newBooking = await createBooking(bookingData as Omit<CalendarEvent, 'id'>)
        setBookings(prev => [...prev, newBooking])
      }
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error saving booking:", error)
    }
  }

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return

    try {
      await deleteBooking(selectedBooking.id)
      setBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
      setIsFormOpen(false)
      setIsDeleteConfirmOpen(false)
    } catch (error) {
      console.error("Error deleting booking:", error)
    }
  }

  const calculateAvailability = (dayBookings: CalendarEvent[]) => {
    const totalSlots = 11
    const bookedSlots = dayBookings.length
    return Math.round(((totalSlots - bookedSlots) / totalSlots) * 100)
  }

  const renderDayView = () => {
    const dayBookings = bookings.filter(
      booking => new Date(booking.date).toDateString() === currentDate.toDateString()
    )

    // Get rooms for current page
    const startIndex = currentPage * ROOMS_PER_PAGE
    const endIndex = startIndex + ROOMS_PER_PAGE
    const visibleRooms = rooms.slice(startIndex, endIndex)

    return (
      <Box sx={{ mt: 3, overflowX: "auto" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Showing rooms {startIndex + 1}-{Math.min(endIndex, rooms.length)} of {rooms.length}
          </Typography>
          <Box>
            <IconButton 
              onClick={handlePrevPage} 
              disabled={currentPage === 0}
              size="small"
            >
              <ChevronLeft />
            </IconButton>
            <IconButton 
              onClick={handleNextPage} 
              disabled={currentPage >= totalPages - 1}
              size="small"
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        <Grid container>
          <Grid item xs={1}>
            <Box sx={{ borderRight: "1px solid", borderColor: "divider", pr: 1 }}>
              <Box sx={{ height: "60px" }}></Box>
              {timeSlots.map((time, index) => (
                <Box key={index} sx={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "flex-end", pr: 1 }}>
                  <Typography variant="body2" color="text.secondary">{time}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {visibleRooms.map((room) => (
            <Grid item xs={2.2} key={room.id}>
              <Box sx={{ borderRight: "1px solid", borderColor: "divider", height: "100%" }}>
                <Box sx={{ height: "60px", p: 1, borderBottom: "1px solid", borderColor: "divider", bgcolor: "rgba(30, 83, 147, 0.1)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>{room.name}</Typography>
                </Box>

                <Box sx={{ position: "relative" }}>
                  {timeSlots.map((_, index) => (
                    <Box key={index} sx={{ height: "80px", borderBottom: "1px solid", borderColor: "divider", bgcolor: index % 2 === 0 ? "rgba(0, 0, 0, 0.02)" : "transparent" }}></Box>
                  ))}

                  {dayBookings
                    .filter(booking => booking.roomId === room.id)
                    .map((booking) => {
                      const [startHour, startMinute] = booking.startTime.split(':').map(Number)
                      const [endHour, endMinute] = booking.endTime.split(':').map(Number)

                      const startPosition = (startHour - 8) * 80 + (startMinute / 60) * 80
                      const duration = (endHour - startHour) * 60 + (endMinute - startMinute)
                      const height = (duration / 60) * 80

                      return (
                        <Box
                          key={booking.id}
                          onClick={() => handleBookingClick(booking)}
                          sx={{
                            position: "absolute",
                            top: `${60 + startPosition}px`,
                            left: "4px",
                            right: "4px",
                            height: `${height}px`,
                            bgcolor: "rgba(30, 83, 147, 0.8)",
                            color: "white",
                            borderRadius: "4px",
                            p: 1,
                            overflow: "hidden",
                            zIndex: 1,
                            cursor: "pointer",
                            '&:hover': { bgcolor: "rgba(30, 83, 147, 1)" }
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>{booking.title}</Typography>
                          <Typography variant="caption">{booking.startTime} - {booking.endTime}</Typography>
                        </Box>
                      )
                    })}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  const renderMonthView = () => {
    return (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={1}>
          {monthDays.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <Grid item xs={12 / 7} key={`${weekIndex}-${dayIndex}`}>
                  {day.type === "dayName" && (
                    <Box sx={{ p: 1, textAlign: "center", bgcolor: "rgba(30, 83, 147, 0.1)", borderRadius: "4px", mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>{day.value}</Typography>
                    </Box>
                  )}

                  {day.type === "day" && (
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="body2">{`${day.bookings.length} Bookings`}</Typography>
                          <Typography variant="body2">{`${calculateAvailability(day.bookings)}% Available`}</Typography>
                        </Box>
                      }
                    >
                      <Card
                        variant="outlined"
                        onClick={() => {
                          setCurrentDate(day.date)
                          setView("day")
                        }}
                        sx={{
                          height: "120px",
                          cursor: "pointer",
                          "&:hover": { boxShadow: 2, bgcolor: "rgba(30, 83, 147, 0.05)" }
                        }}
                      >
                        <CardContent sx={{ p: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>{day.value}</Typography>
                          <Box sx={{ height: "60px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ResponsiveContainer width="80%" height="80%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: "Available", value: calculateAvailability(day.bookings) },
                                    { name: "Booked", value: 100 - calculateAvailability(day.bookings) },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={15}
                                  outerRadius={25}
                                  paddingAngle={2}
                                  dataKey="value"
                                >
                                  <Cell fill="#4caf50" />
                                  <Cell fill="#f44336" />
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center" }}>
                            {day.bookings.length} bookings
                          </Typography>
                        </CardContent>
                      </Card>
                    </Tooltip>
                  )}

                  {day.type === "empty" && (
                    <Box sx={{ height: "120px", bgcolor: "rgba(0, 0, 0, 0.03)", borderRadius: "4px" }} />
                  )}
                </Grid>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    )
  }

  return (
    <AdminSidebar>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={view === "day" ? handlePrevDay : handlePrevMonth}>
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6" sx={{ minWidth: 300, textAlign: "center" }}>
                  {formatDate(currentDate, view)}
                </Typography>
                <IconButton onClick={view === "day" ? handleNextDay : handleNextMonth}>
                  <ChevronRight />
                </IconButton>
              </Box>

              <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} aria-label="calendar view">
                <ToggleButton value="day" aria-label="day view">
                  <CalendarViewDayIcon sx={{ mr: 1 }} /> Day
                </ToggleButton>
                <ToggleButton value="month" aria-label="month view">
                  <CalendarViewMonthIcon sx={{ mr: 1 }} /> Month
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider sx={{ mb: 3 }} />
            {view === "day" ? renderDayView() : renderMonthView()}
          </Paper>
        </Box>

        <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedBooking ? "Booking Details" : "Create Booking"}</DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <BookingForm
                rooms={rooms}
                onSubmit={handleBookingSubmit}
                onCancel={() => setIsFormOpen(false)}
                initialData={selectedBooking}
                currentDate={new Date(selectedBooking.date)}
                onDelete={() => {
                  setIsDeleteConfirmOpen(true)
                  setIsFormOpen(false)
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this booking?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteBooking} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminSidebar>
  )
}

export default AdminCalendar