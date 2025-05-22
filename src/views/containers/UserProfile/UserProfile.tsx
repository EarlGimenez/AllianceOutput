"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogTitle
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import TableViewIcon from "@mui/icons-material/TableView";
import EventIcon from "@mui/icons-material/Event";
import { LandingNav } from "../../components/LandingNav";
import { SiteFooter } from "../../components/SiteFooter";
import BookingForm from "../../components/BookingForm";
import { createBooking, updateBooking, deleteBooking, getBookings as fetchBookings } from "../../services/bookingService";
import { getRooms } from "../../services/roomService";
import { format, parseISO, getDate, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

interface UserBooking {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  roomId: string;
  description: string;
  userId: string;
  recurrenceRule?: string;
}

interface Room {
  id: string;
  name: string;
  location: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const parseRecurrenceRule = (rule: string) => {
  const freqMatch = rule.match(/FREQ=([A-Z]+)/);
  const byDayMatch = rule.match(/BYDAY=([A-Z,]+)/);
  const untilMatch = rule.match(/UNTIL=([0-9TZ]+)/);
  
  return {
    freq: freqMatch ? freqMatch[1] : 'DAILY',
    days: byDayMatch ? byDayMatch[1].split(',') : [],
    until: untilMatch ? new Date(untilMatch[1].replace(
      /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, 
      '$1-$2-$3T$4:$5:$6Z'
    )) : null
  };
};

const generateRecurringDates = (startDate: Date, ruleStr: string, maxCount = 100): Date[] => {
  if (!ruleStr) return [startDate];
  
  const rule = parseRecurrenceRule(ruleStr);
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (dates.length < maxCount) {
    if (rule.until && currentDate > rule.until) break;
    
    // Check if current date matches the BYDAY rules
    const dayOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][currentDate.getDay()];
    const isValidDay = rule.days.length === 0 || rule.days.includes(dayOfWeek);

    if (isValidDay) {
      dates.push(new Date(currentDate));
    }

    // Move to next date based on frequency
    switch (rule.freq) {
      case "DAILY":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "WEEKLY":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "MONTHLY":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
        currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return dates;
};

const bookingOccursOnDate = (booking: UserBooking, date: Date) => {
  const bookingDate = parseISO(booking.date);
  
  if (!booking.recurrenceRule) {
    return isSameDay(bookingDate, date);
  }

  const recurringDates = generateRecurringDates(bookingDate, booking.recurrenceRule);
  return recurringDates.some(d => isSameDay(d, date));
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const UserProfile: React.FC = () => {
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tabValue, setTabValue] = useState(0);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<UserBooking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const username = localStorage.getItem("user.name") || "User";
  const email = localStorage.getItem("user.email") || "user@example.com";
  const userId = localStorage.getItem("userId") || "";

  const flattenedBookings = useMemo(() => {
    return bookings.flatMap(booking => {
      if (!booking.recurrenceRule) {
        return [{ 
          ...booking,
          date: booking.date, 
          isRecurring: false 
        }];
      }
      
      const bookingDate = parseISO(booking.date);
      const dates = generateRecurringDates(bookingDate, booking.recurrenceRule);
      
      return dates.map(date => ({
        ...booking,
        date: format(date, 'yyyy-MM-dd'), 
        isRecurring: true
      }));
    });
  }, [bookings]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomsData, bookingsData] = await Promise.all([
          getRooms(),
          fetchBookings(userId)
        ]);
        setRooms(roomsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [userId]);

  const handleCreateBooking = async (bookingData: Partial<UserBooking>) => {
    try {
      const newBooking = await createBooking({
        ...bookingData,
        userId,
        roomId: bookingData.roomId || ""
      } as Omit<UserBooking, 'id'>);
      setBookings([...bookings, newBooking]);
      setIsBookingFormOpen(false);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleUpdateBooking = async (bookingData: Partial<UserBooking>) => {
    if (!editingBooking) return;
    
    try {
      const updatedBooking = await updateBooking(editingBooking.id, bookingData);
      setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
      setIsBookingFormOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    
    try {
      await deleteBooking(bookingToDelete);
      setBookings(bookings.filter(b => b.id !== bookingToDelete));
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      if (editingBooking?.id === bookingToDelete) {
        setIsBookingFormOpen(false);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleBookingSubmit = (bookingData: Partial<UserBooking>) => {
    if (editingBooking) {
      handleUpdateBooking(bookingData);
    } else {
      handleCreateBooking(bookingData);
    }
  };

  const filteredBookings = showAllBookings 
    ? flattenedBookings 
    : flattenedBookings.filter(booking => 
        isSameDay(parseISO(booking.date), selectedDate)
      );

  const getRoomName = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.name || "Unknown Room";
  };

  const getRoomLocation = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.location || "Unknown Location";
  };

  const formatDisplayDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM d, yyyy");
  };

const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const startingDay = firstDay.getDay();
    
    // Create empty array for days (with leading empty slots if needed)
    const days = Array(startingDay).fill(null);

    // Fill in the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        dayOfMonth: i,
        hasBooking: flattenedBookings.some(b => isSameDay(parseISO(b.date), date))
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8; // Starting at 8am
    return `${hour}:00 - ${hour + 1}:00`;
  });

  const getBookingsForTimeSlot = (timeSlot: string, date: Date) => {
    const [startTime] = timeSlot.split(' - ');
    return filteredBookings.filter(booking => 
      booking.startTime.startsWith(startTime) && 
      isSameDay(parseISO(booking.date), date)
    );
  };
  
  const getDayCellStyle = (day: any) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: "100%",
    borderRadius: "50%",
    cursor: "pointer",
    backgroundColor: day?.date && isSameDay(day.date, selectedDate) ? "#1e5393" : "transparent",
    color: day?.date && isSameDay(day.date, selectedDate) ? "white" : 
          day?.hasBooking ? "#1e5393" : day ? "inherit" : "transparent",
    "&:hover": {
      backgroundColor: day?.date && isSameDay(day.date, selectedDate) ? "#1e5393" : "rgba(0, 0, 0, 0.04)",
    },
  });

 const renderListView = () => (
    <Box>
      {filteredBookings.length > 0 ? (
        filteredBookings.map(booking => (
          <Paper key={`${booking.id}-${booking.date}`} sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6">{booking.title || getRoomName(booking.roomId)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <Box component="span" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16, mr: 1 }} />
                    {format(parseISO(booking.date), "MMM d, yyyy")}
                  </Box>
                  <Box component="span" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 1 }} />
                    {booking.startTime} - {booking.endTime}
                  </Box>
                  <Box component="span" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
                    {getRoomLocation(booking.roomId)}
                  </Box>
                  {booking.isRecurring && (
                    <Box component="span" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <EventIcon sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="caption">Recurring Booking</Typography>
                    </Box>
                  )}
                </Typography>
              </Box>
             <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setEditingBooking(booking);
                    setIsBookingFormOpen(true);
                  }}
                  size="small"
                  sx={{ 
                    color: 'primary.main',
                    textTransform: 'none',
                    minWidth: 0
                  }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setBookingToDelete(booking.id);
                    setDeleteDialogOpen(true);
                  }}
                  size="small"
                  sx={{ 
                    color: 'error.main',
                    textTransform: 'none',
                    minWidth: 0
                  }}
                >
                  Delete
                </Button>
              </Box>

            </Box>
          </Paper>
        ))
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
          No bookings found for the selected date.
        </Typography>
      )}
    </Box>
  );

  // Fix table view rendering
  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="bookings table">
        <TableHead>
          <TableRow>
            <TableCell>Room</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Recurring</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <TableRow key={`${booking.id}-${booking.date}`}>
                <TableCell>{booking.title || getRoomName(booking.roomId)}</TableCell>
                <TableCell>{format(parseISO(booking.date), "MMM d, yyyy")}</TableCell>
                <TableCell>{`${booking.startTime} - ${booking.endTime}`}</TableCell>
                <TableCell>{getRoomLocation(booking.roomId)}</TableCell>
                <TableCell>{booking.isRecurring ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setEditingBooking(booking);
                        setIsBookingFormOpen(true);
                      }}
                      size="small"
                      sx={{ 
                        color: 'primary.main',
                        textTransform: 'none',
                        minWidth: 0
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setBookingToDelete(booking.id);
                        setDeleteDialogOpen(true);
                      }}
                      size="small"
                      sx={{ 
                        color: 'error.main',
                        textTransform: 'none',
                        minWidth: 0
                      }}
                    >
                      Delete
                    </Button>
                  </Box>


                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center", py: 3 }}>
                No bookings found for the selected date.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Fix calendar view to prevent overlap and show multiple bookings
  const renderCalendarView = () => {
    const timeSlots: { start: string, end: string }[] = [];
    
    // Generate time slots from 7am to 10pm
    for (let hour = 7; hour <= 22; hour++) {
      timeSlots.push({
        start: `${hour.toString().padStart(2, '0')}:00`,
        end: `${(hour + 1).toString().padStart(2, '0')}:00`
      });
    }

    return (
      <Paper sx={{ p: 2, mb: 3 }}>
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
                <Typography variant="body2">{slot.start}</Typography>
              </Box>
            ))}
          </Grid>
          <Grid item xs={10}>
            <Typography
              variant="subtitle2"
              sx={{ p: 1, textAlign: "center", fontWeight: "bold", backgroundColor: "#f5f5f5" }}
            >
              {format(selectedDate, "MMMM d, yyyy")}
            </Typography>
            {timeSlots.map((slot, index) => {
              const slotBookings = filteredBookings
                .filter(booking => {
                  if (!isSameDay(parseISO(booking.date), selectedDate)) return false;
                  
                  const slotStart = slot.start;
                  const slotEnd = slot.end;
                  const bookingStart = booking.startTime;
                  const bookingEnd = booking.endTime;
                  
                  return !(bookingEnd <= slotStart || bookingStart >= slotEnd);
                })
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <Box
                  key={index}
                  sx={{
                    p: 1,
                    height: 80,
                    borderTop: "1px solid #eee",
                    borderLeft: "1px solid #eee",
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {slotBookings.map((booking, idx) => {
                    const startMins = parseInt(booking.startTime.split(':')[0]) * 60 + parseInt(booking.startTime.split(':')[1]);
                    const endMins = parseInt(booking.endTime.split(':')[0]) * 60 + parseInt(booking.endTime.split(':')[1]);
                    const slotStartMins = parseInt(slot.start.split(':')[0]) * 60 + parseInt(slot.start.split(':')[1]);
                    
                    const top = Math.max(0, (startMins - slotStartMins) / 60 * 80);
                    const height = Math.min(
                      80, 
                      ((endMins - Math.max(startMins, slotStartMins)) / 60 * 80)
                    );

                    const left = `${(idx * 33) % 100}%`;
                    const width = '30%';
                    const zIndex = idx + 1;

                    return (
                      <Paper
                        key={`${booking.id}-${booking.date}`}
                        sx={{
                          position: 'absolute',
                          top: `${top}px`,
                          height: `${height}px`,
                          left,
                          width,
                          zIndex,
                          p: 0.5,
                          bgcolor: booking.isRecurring ? "#ffe0b2" : "#c8e6c9",
                          color: booking.isRecurring ? "#e65100" : "#2e7d32",
                          overflow: 'hidden',
                          borderLeft: `3px solid ${booking.isRecurring ? "#fb8c00" : "#4caf50"}`,
                          '&:hover': {
                            boxShadow: 1,
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold" noWrap fontSize="0.8rem">
                          {booking.title || getRoomName(booking.roomId)}
                        </Typography>
                        <Typography variant="caption" noWrap fontSize="0.7rem">
                          {booking.startTime}-{booking.endTime}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#fff" }}>
      <LandingNav />

      <Box component="main" sx={{ flexGrow: 1, display: "flex", height: "calc(100vh - 64px)" }}>
        {/* Calendar Sidebar */}
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: "primary.main" }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" component="h2" gutterBottom>
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upcoming Bookings</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <IconButton size="small" onClick={goToPreviousMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="subtitle1">
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <IconButton size="small" onClick={goToNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        
        {/* Weekday headers */}
        <Grid container spacing={1}>
          {weekdays.map((day, index) => (
            <Grid item key={index} xs={12 / 7}>
              <Typography
                variant="caption"
                align="center"
                sx={{ display: "block", fontWeight: "medium" }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
        
        {/* Calendar days */}
        <Grid container spacing={1} sx={{ mt: 0 }}>
          {generateCalendarDays().map((day, index) => (
            <Grid item key={index} xs={12 / 7}>
              {day ? (
                <Box
                  onClick={() => setSelectedDate(day.date)}
                  sx={getDayCellStyle(day)}
                >
                  <Typography variant="body2">{day.dayOfMonth}</Typography>
                </Box>
              ) : (
                <Box sx={{ height: 32 }}></Box> // Empty cell
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="h1">My Bookings</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingBooking(null);
                setIsBookingFormOpen(true);
              }}
            >
              Create Booking
            </Button>
          </Box>

          <Box sx={{ p: 2, mb: 3, border: "1px solid #eee", borderRadius: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">{format(selectedDate, "MMMM d, yyyy")}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAllBookings}
                    onChange={(e) => setShowAllBookings(e.target.checked)}
                  />
                }
                label="Show all bookings"
              />
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                <Tab label="List View" icon={<ViewListIcon />} iconPosition="start" {...a11yProps(0)} />
                <Tab label="Table View" icon={<TableViewIcon />} iconPosition="start" {...a11yProps(1)} />
                <Tab label="Calendar View" icon={<EventIcon />} iconPosition="start" {...a11yProps(2)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {renderListView()}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderTableView()}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {renderCalendarView()}
            </TabPanel>
          </Box>
        </Box>
      </Box>

      {/* Booking Form Dialog */}
      <Dialog
        open={isBookingFormOpen}
        onClose={() => {
          setIsBookingFormOpen(false);
          setEditingBooking(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingBooking ? "Edit Booking" : "Create Booking"}</DialogTitle>
        <DialogContent>
          <BookingForm
            rooms={rooms}
            onSubmit={handleBookingSubmit}
            onCancel={() => {
              setIsBookingFormOpen(false);
              setEditingBooking(null);
            }}
            initialData={editingBooking || undefined}
            onDelete={editingBooking ? () => {
              setBookingToDelete(editingBooking.id);
              setDeleteDialogOpen(true);
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
          <Button onClick={handleDeleteBooking} color="error">Yes, Cancel</Button>
        </DialogActions>
      </Dialog>

      <SiteFooter />
    </Box>
  );
};

export default UserProfile;
