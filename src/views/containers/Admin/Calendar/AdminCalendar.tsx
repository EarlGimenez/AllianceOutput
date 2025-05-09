"use client"

import React, { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Tooltip,
  Card,
  CardContent,
  Divider,
} from "@mui/material"
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay"
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { AdminSidebar } from "../../../components/AdminSidebar"
import { AdminHeader } from "../../../components/AdminHeader"

type DayCell =
  | { type: "dayName"; value: string }
  | { type: "empty" }
  | {
      type: "day"
      value: number
      date: Date
      reservations: number
      availability: number
    }

const AdminCalendar: React.FC = () => {
  const theme = useTheme()
  const [view, setView] = useState<"day" | "month">("day")
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: "day" | "month" | null) => {
    if (newView !== null) {
      setView(newView)
    }
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

  // Mock data for rooms
  const rooms = [
    { id: 1, name: "Conference Room A", location: "1st Floor" },
    { id: 2, name: "Meeting Room 101", location: "2nd Floor" },
    { id: 3, name: "Board Room", location: "3rd Floor" },
    { id: 4, name: "Huddle Space 1", location: "1st Floor" },
    { id: 5, name: "Training Room", location: "2nd Floor" },
  ]

  // Mock data for meetings
  const meetings = [
    {
      id: 1,
      roomId: 1,
      title: "Team Standup",
      start: "09:00",
      end: "09:30",
      organizer: "John Doe",
    },
    {
      id: 2,
      roomId: 2,
      title: "Product Review",
      start: "10:00",
      end: "11:30",
      organizer: "Sarah Johnson",
    },
    {
      id: 3,
      roomId: 3,
      title: "Board Meeting",
      start: "13:00",
      end: "15:00",
      organizer: "Michael Chen",
    },
    {
      id: 4,
      roomId: 1,
      title: "Client Call",
      start: "14:00",
      end: "15:00",
      organizer: "Emily Davis",
    },
    {
      id: 5,
      roomId: 4,
      title: "Project Sync",
      start: "11:00",
      end: "12:00",
      organizer: "David Miller",
    },
  ]

  // Generate time slots for day view
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8 // Starting from 8 AM
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
  })

  // Generate days for month view
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const generateMonthDays = (): DayCell[][] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = new Date(year, month, 1).getDay()
  
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
    const days: DayCell[][] = []
  
    // Add day name headers
    days.push(dayNames.map((day) => ({ type: "dayName", value: day })) as DayCell[])
  
    let week: DayCell[] = []
  
    for (let i = 0; i < firstDay; i++) {
      week.push({ type: "empty" })
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({
        type: "day",
        value: day,
        date: new Date(year, month, day),
        reservations: Math.floor(Math.random() * 10),
        availability: Math.floor(Math.random() * 100),
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

  // Render day view
  const renderDayView = () => {
    return (
      <Box sx={{ mt: 3, overflowX: "auto" }}>
        <Grid container>
          {/* Time column */}
          <Grid item xs={1}>
            <Box sx={{ borderRight: "1px solid", borderColor: "divider", pr: 1 }}>
              <Box sx={{ height: "60px" }}></Box> {/* Empty space for header */}
              {timeSlots.map((time, index) => (
                <Box
                  key={index}
                  sx={{
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    pr: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Room columns */}
          {rooms.map((room) => (
            <Grid item xs={2} key={room.id}>
              <Box
                sx={{
                  borderRight: "1px solid",
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                {/* Room header */}
                <Box
                  sx={{
                    height: "60px",
                    p: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(30, 83, 147, 0.1)",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>
                    {room.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {room.location}
                  </Typography>
                </Box>

                {/* Time slots */}
                <Box sx={{ position: "relative" }}>
                  {timeSlots.map((time, index) => (
                    <Box
                      key={index}
                      sx={{
                        height: "80px",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        bgcolor: index % 2 === 0 ? "rgba(0, 0, 0, 0.02)" : "transparent",
                      }}
                    ></Box>
                  ))}

                  {/* Meetings */}
                  {meetings
                    .filter((meeting) => meeting.roomId === room.id)
                    .map((meeting) => {
                      // Calculate position and height
                      const startHour = Number.parseInt(meeting.start.split(":")[0])
                      const startMinute = Number.parseInt(meeting.start.split(":")[1])
                      const endHour = Number.parseInt(meeting.end.split(":")[0])
                      const endMinute = Number.parseInt(meeting.end.split(":")[1])

                      const startPosition = (startHour - 8) * 80 + (startMinute / 60) * 80
                      const duration = (endHour - startHour) * 60 + (endMinute - startMinute)
                      const height = (duration / 60) * 80

                      return (
                        <Box
                          key={meeting.id}
                          sx={{
                            position: "absolute",
                            top: `${60 + startPosition}px`, // 60px for the header
                            left: "4px",
                            right: "4px",
                            height: `${height}px`,
                            bgcolor: "rgba(30, 83, 147, 0.8)",
                            color: "white",
                            borderRadius: "4px",
                            p: 1,
                            overflow: "hidden",
                            zIndex: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {meeting.title}
                          </Typography>
                          <Typography variant="caption">
                            {meeting.start} - {meeting.end}
                          </Typography>
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

  // Render month view
  const renderMonthView = () => {
    return (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={1}>
            {monthDays.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
                {week.map((day: DayCell, dayIndex) => (
                <Grid item xs={12 / 7} key={`${weekIndex}-${dayIndex}`}>
                    {day.type === "dayName" && (
                    <Box
                        sx={{
                        p: 1,
                        textAlign: "center",
                        bgcolor: "rgba(30, 83, 147, 0.1)",
                        borderRadius: "4px",
                        mb: 1,
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>
                        {day.value}
                        </Typography>
                    </Box>
                    )}

                    {day.type === "day" && (
                    <Tooltip
                        title={
                        <Box>
                            <Typography variant="body2">{`${day.reservations} Reservations`}</Typography>
                            <Typography variant="body2">{`${day.availability}% Available`}</Typography>
                        </Box>
                        }
                    >
                        <Card
                        variant="outlined"
                        sx={{
                            height: "120px",
                            cursor: "pointer",
                            "&:hover": {
                            boxShadow: 2,
                            bgcolor: "rgba(30, 83, 147, 0.05)",
                            },
                        }}
                        >
                        <CardContent sx={{ p: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {day.value}
                            </Typography>

                            <Box
                            sx={{ height: "60px", display: "flex", justifyContent: "center", alignItems: "center" }}
                            >
                            <ResponsiveContainer width="80%" height="80%">
                                <PieChart>
                                <Pie
                                    data={[
                                    { name: "Available", value: day.availability },
                                    { name: "Booked", value: 100 - day.availability },
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

                            <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", textAlign: "center" }}
                            >
                            {day.reservations} bookings
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6">{formatDate(currentDate)}</Typography>

              <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} aria-label="calendar view">
                <ToggleButton value="day" aria-label="day view">
                  <CalendarViewDayIcon sx={{ mr: 1 }} />
                  Day
                </ToggleButton>
                <ToggleButton value="month" aria-label="month view">
                  <CalendarViewMonthIcon sx={{ mr: 1 }} />
                  Month
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {view === "day" ? renderDayView() : renderMonthView()}
          </Paper>
        </Box>
      </Box>
    </AdminSidebar>
  )
}

export default AdminCalendar
