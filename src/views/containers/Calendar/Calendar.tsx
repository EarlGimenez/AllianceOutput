import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { CalendarEvent, Room } from '../../components/CalendarEvents';
import { LandingNav } from '../../components/LandingNav';
import BookingForm from '../../components/BookingForm';
import { getRooms } from '../../services/roomService';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../../services/bookingService';

const Calendar: React.FC = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'month'>('day');
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [formDate, setFormDate] = useState<Date | undefined>(currentDate);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  const dayLabelsShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const fetchRoomsAndBookings = async () => {
    try {
      const fetchedRooms = await getRooms();
      const fetchedBookings = await getBookings();
      setRooms(fetchedRooms);
      setEvents(fetchedBookings);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchRoomsAndBookings();
  }, []);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, dayEvents: CalendarEvent[], date: Date) => {
    setPopoverAnchorEl(event.currentTarget);
    setPopoverEvents(dayEvents);
    setPopoverDate(date);
  };

  const handlePopoverClose = () => setPopoverAnchorEl(null);
  const openPopover = Boolean(popoverAnchorEl);
  const popoverId = openPopover ? 'month-day-popover' : undefined;

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'day' | 'month' | null) => {
    if (newView) setView(newView);
  };

  const handleDateNavigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'day') {
        newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
      } else {
        newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      }
      return newDate;
    });
  };

  const handleOpenBookingForm = (eventToEdit?: CalendarEvent, dateForNew?: Date) => {
    setEditingEvent(eventToEdit);
    setFormDate(eventToEdit ? new Date(eventToEdit.date + 'T00:00:00') : dateForNew || currentDate);
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setEditingEvent(undefined);
  };

  const handleBookingSubmit = async (bookingData: Partial<CalendarEvent>) => {
    try {
      if (bookingData.id) {
        await updateBooking(bookingData.id, bookingData);
      } else {
        await createBooking(bookingData as Omit<CalendarEvent, 'id'>);
      }
      fetchRoomsAndBookings(); // Refetch all data to ensure UI is in sync
    } catch (error) {
      console.error('Failed to save booking:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Could not save booking.'}`);
    } finally {
      handleCloseBookingForm();
    }
  };

  const handleRequestDelete = (eventId: string) => {
    setEventToDeleteId(eventId);
    setDeleteConfirmOpen(true);
    if (editingEvent?.id === eventId) {
      handleCloseBookingForm();
    }
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setEventToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (eventToDeleteId) {
      try {
        await deleteBooking(eventToDeleteId);
        fetchRoomsAndBookings(); // Refetch
      } catch (error) {
        console.error('Failed to delete booking:', error);
        alert(`Error: ${error instanceof Error ? error.message : 'Could not delete booking.'}`);
      } finally {
        handleCloseDeleteConfirm();
      }
    }
  };

  const handleEventInteraction = (event: CalendarEvent) => handleOpenBookingForm(event);
  const handleDayClickInMonthView = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const isEventOnDay = (event: CalendarEvent, day: Date): boolean => {
    const eventStartDate = new Date(event.date);
    eventStartDate.setHours(0, 0, 0, 0);

    const currentDayStart = new Date(day);
    currentDayStart.setHours(0, 0, 0, 0);

    // Handle non-recurring events
    if (!event.recurrenceType && !event.recurrenceRule) {
        return eventStartDate.getTime() === currentDayStart.getTime();
    }

    // Event series hasn't started yet
    if (currentDayStart < eventStartDate) {
        return false;
    }

    // Use new fields first
    if (event.recurrenceType) {
        if (event.recurrenceUntil) {
            const untilDate = new Date(event.recurrenceUntil);
            untilDate.setHours(23, 59, 59, 999); // End of the until day
            if (currentDayStart > untilDate) {
                return false;
            }
        }

        switch (event.recurrenceType) {
            case 'daily':
                return true;
            case 'weekly':
                const byDay = event.recurrenceByDay?.split(',') || [];
                const currentDay = dayLabelsShort[currentDayStart.getDay()].substring(0, 2).toUpperCase();
                return byDay.includes(currentDay);
            case 'monthly':
                return currentDayStart.getDate() === eventStartDate.getDate();
            default:
                return false;
        }
    }

    // Fallback to old recurrenceRule for existing data
    if (event.recurrenceRule) {
        const untilMatch = event.recurrenceRule.match(/UNTIL=([0-9]{8}T[0-9]{6}Z)/);
        if (untilMatch?.[1]) {
            const untilDateStr = untilMatch[1];
            const recurrenceEndDateUtc = new Date(untilDateStr.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z'));
            if (currentDayStart > recurrenceEndDateUtc) {
                return false;
            }
        }

        if (event.recurrenceRule.includes('FREQ=DAILY')) {
            return true;
        }
        if (event.recurrenceRule.includes('FREQ=WEEKLY')) {
            const byDayMatch = event.recurrenceRule.match(/BYDAY=([A-Z,]+)/);
            const currentDayOfWeekShort = dayLabelsShort[currentDayStart.getDay()].substring(0, 2).toUpperCase();
            if (byDayMatch?.[1]) {
                return byDayMatch[1].split(',').includes(currentDayOfWeekShort);
            }
            return currentDayStart.getDay() === eventStartDate.getDay();
        }
        if (event.recurrenceRule.includes('FREQ=MONTHLY')) {
            return currentDayStart.getDate() === eventStartDate.getDate();
        }
    }

    return false;
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOffset = firstDayOfMonth.getDay();
    const cells = [];

    for (let i = 0; i < startDayOffset; i++) {
      cells.push(<Paper variant="outlined" square key={`empty-start-${i}`} sx={{ minHeight: 120, bgcolor: 'grey.50' }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const isCurrentSelectedDate = cellDate.toDateString() === currentDate.toDateString();
      const eventsForDay = events.filter(event => isEventOnDay(event, cellDate));

      cells.push(
        <Paper
          elevation={isCurrentSelectedDate ? 4 : 1}
          square
          key={`day-${day}`}
          aria-haspopup="true"
          onMouseEnter={(e) => eventsForDay.length > 0 && handlePopoverOpen(e, eventsForDay, cellDate)}
          onClick={() => handleDayClickInMonthView(cellDate)}
          sx={{
            minHeight: 120, p: 1, boxSizing: 'border-box',
            bgcolor: isCurrentSelectedDate ? theme.palette.primary.light : 'background.paper',
            border: isCurrentSelectedDate ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
            cursor: 'pointer', position: 'relative', overflow: 'hidden',
            '&:hover': { bgcolor: theme.palette.action.hover },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textAlign: 'right', mb: 0.5 }}>
            {day}
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {eventsForDay.slice(0, 3).map(event => (
              <Typography key={event.id} variant="caption" display="block" sx={{
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  bgcolor: 'primary.main', color: 'primary.contrastText',
                  p: '2px 4px', borderRadius: '4px', mb: '2px',
              }}>
                {event.title}
              </Typography>
            ))}
            {eventsForDay.length > 3 && (
              <Typography variant="caption" sx={{ textAlign: 'center', mt: 0.5 }}>
                +{eventsForDay.length - 3} more
              </Typography>
            )}
          </Box>
        </Paper>
      );
    }

    const totalGridCells = Math.ceil((startDayOffset + daysInMonth) / 7) * 7;
    while (cells.length < totalGridCells) {
      cells.push(<Paper variant="outlined" square key={`empty-end-${cells.length}`} sx={{ minHeight: 120, bgcolor: 'grey.50' }} />);
    }

    return (
      <Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
          {dayLabelsShort.map(dayName => (
            <Typography key={dayName} variant="caption" sx={{ textAlign: 'center', p: 1, color: 'text.secondary', fontWeight: 'medium' }}>
              {dayName}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {cells}
        </Box>
      </Box>
    );
  };

  const renderDayView = () => {
    const eventsForDay = events.filter(event => isEventOnDay(event, currentDate));
    const roomIds = rooms.map(r => r.id);

    return (
      <Box sx={{ display: 'flex', pb: 2, overflowX: 'auto' }}>
        <Box sx={{ minWidth: '80px', pr: 1 }}>
          <Box sx={{ height: '40px', mb: 1 }} />
          {timeSlots.map(time => (
            <Box key={time} sx={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">{time}</Typography>
            </Box>
          ))}
        </Box>
        {rooms.map(room => (
          <Box key={room.id} sx={{ minWidth: '200px', flex: '1 1 0px', borderLeft: '1px solid', borderColor: 'divider' }}>
            <Paper variant="outlined" square sx={{ textAlign: 'center', p: 1, height: '40px', mb:1, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle2">{room.name}</Typography>
            </Paper>
            <Box sx={{ position: 'relative', height: `${timeSlots.length * 60}px` }}>
              {eventsForDay
                .filter(event => event.roomId === room.id)
                .map(event => (
                  <Paper
                    elevation={2}
                    key={event.id}
                    sx={{
                      position: 'absolute', left: '4px', right: '4px',
                      top: calculateEventPosition(event.startTime),
                      height: calculateEventHeight(event.startTime, event.endTime),
                      bgcolor: 'primary.main', color: 'primary.contrastText',
                      p: 1, borderRadius: 1, overflow: 'hidden', cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                    onClick={() => handleEventInteraction(event)}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
                    <Typography variant="caption">{`${event.startTime} - ${event.endTime}`}</Typography>
                  </Paper>
                ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const calculateEventPosition = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutesFrom8AM = (hours - 8) * 60 + minutes;
    return `${totalMinutesFrom8AM}px`;
  };

  const calculateEventHeight = (startTime: string, endTime: string): string => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    return `${Math.max(30, durationMinutes)}px`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LandingNav />
      <Box sx={{ flexGrow: 1, bgcolor: "#D2E4FF", p: { xs: 1, sm: 2, md: 3 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Button variant="contained" onClick={() => handleOpenBookingForm(undefined, currentDate)} sx={{ order: { xs: 3, sm: 1 } }}>
              + Create Booking
            </Button>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ order: { xs: 1, sm: 2 } }}>
              <Button onClick={() => handleDateNavigate('prev')}>{'<'}</Button>
              <Typography variant="h6" sx={{ userSelect: 'none' }}>
                {view === 'day'
                  ? currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Typography>
              <Button onClick={() => handleDateNavigate('next')}>{'>'}</Button>
            </Stack>
            <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small" sx={{ order: { xs: 2, sm: 3 } }}>
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {view === 'day' ? renderDayView() : renderMonthView()}
          </Box>
        </Paper>
      </Box>

      <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          {popoverDate && <Typography variant="h6" gutterBottom>Events for {popoverDate.toLocaleDateString()}</Typography>}
          <List dense>
            {popoverEvents.map(event => (
              <ListItem key={event.id} disablePadding>
                <Link component="button" onClick={() => { handleEventInteraction(event); handlePopoverClose(); }} sx={{ width: '100%', textAlign: 'left' }}>
                  <ListItemText primary={event.title} secondary={`${event.startTime} - ${event.endTime}`} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      <Dialog open={isBookingFormOpen} onClose={handleCloseBookingForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEvent ? 'Edit Booking' : 'Create Booking'}</DialogTitle>
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

      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this reservation? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;