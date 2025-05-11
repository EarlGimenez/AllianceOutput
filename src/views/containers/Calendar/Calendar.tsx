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
} from '@mui/material';
// import EventNoteIcon from '@mui/icons-material/EventNote'; // Example icon for events
import { CalendarEvent, Room } from '../../components/CalendarEvents';
import { LandingNav } from '../../components/LandingNav';
import BookingForm from '../../components/BookingForm';
// To potentially add a footer later, you might import:
// import { SiteFooter } from '../../components/SiteFooter';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent?: (newEvent: Partial<CalendarEvent>) => void;
  onEditEvent?: (updatedEvent: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  currentDate: Date;
  onDateChange?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events: initialEvents,
  onAddEvent: parentOnAddEvent,
  onEditEvent: parentOnEditEvent,
  currentDate,
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const rooms: Room[] = [
    'Meeting Room',
    'School Classroom',
    'Professional Studio',
    'Science Lab',
    'Coworking Space',
  ];

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i; // Start from 8 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const [view, setView] = useState<'day' | 'month'>('day');

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);

  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [formDate, setFormDate] = useState<Date | undefined>(currentDate);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    dayEvents: CalendarEvent[],
    date: Date
  ) => {
    setPopoverAnchorEl(event.currentTarget);
    setPopoverEvents(dayEvents);
    setPopoverDate(date);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const openPopover = Boolean(popoverAnchorEl);
  const popoverId = openPopover ? 'month-day-popover' : undefined;

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'day' | 'month' | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleOpenBookingForm = (eventToEdit?: CalendarEvent, dateForNew?: Date) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setFormDate(undefined);
    } else {
      setEditingEvent(undefined);
      setFormDate(dateForNew || currentDate);
    }
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setEditingEvent(undefined);
    setFormDate(undefined);
  };

  const handleBookingSubmit = (bookingData: Partial<CalendarEvent>) => {
    console.log('Booking submitted:', bookingData);
    if (bookingData.id) {
      if (parentOnEditEvent) {
        parentOnEditEvent(bookingData as CalendarEvent);
      } else {
        setEvents(prevEvents => prevEvents.map(ev => ev.id === bookingData.id ? {...ev, ...bookingData} as CalendarEvent : ev));
      }
    } else {
      const newEventWithId = { ...bookingData, id: Date.now().toString() } as CalendarEvent;
      if (parentOnAddEvent) {
        parentOnAddEvent(newEventWithId);
      } else {
        setEvents(prevEvents => [...prevEvents, newEventWithId]);
      }
    }
    handleCloseBookingForm();
  };

  const handleCreateButtonClick = () => {
    handleOpenBookingForm(undefined, currentDate);
  };

  const handleEventInteraction = (event: CalendarEvent) => {
    handleOpenBookingForm(event);
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOffset = firstDayOfMonth.getDay();
    const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const cells = [];

    for (let i = 0; i < startDayOffset; i++) {
      cells.push(
        <Paper
          variant="outlined"
          square
          key={`empty-start-${i}`}
          sx={{
            minHeight: { xs: 100, sm: 120, md: 140 },
            p: 1,
            boxSizing: 'border-box',
            bgcolor: 'grey.50',
            border: '1px solid transparent',
          }}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const cellDateString = cellDate.toISOString().split('T')[0];
      const eventsForDay = events.filter(event => {
        if (event.date === cellDateString && !event.recurrenceRule) {
          return true;
        }
        if (event.recurrenceRule && event.date === cellDateString) {
          // This is a simplification. Proper recurrence calculation (e.g. rrule.js) is needed here.
          return true;
        }
        return false;
      });

      cells.push(
        <Paper
          elevation={1}
          square
          key={`day-${day}`}
          aria-owns={openPopover && popoverDate?.getTime() === cellDate.getTime() ? popoverId : undefined}
          aria-haspopup="true"
          onMouseEnter={(e) => eventsForDay.length > 0 && handlePopoverOpen(e, eventsForDay, cellDate)}
          onMouseLeave={handlePopoverClose}
          sx={{
            minHeight: { xs: 100, sm: 120, md: 140 },
            p: 1,
            boxSizing: 'border-box',
            bgcolor: eventsForDay.length > 0 ? '#e3f2fd' : '#0d47a1',
            color: eventsForDay.length > 0 ? 'primary.dark' : 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            cursor: eventsForDay.length > 0 ? 'pointer' : 'default',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              bgcolor: eventsForDay.length > 0 ? '#bbdefb' : '#1565c0',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', alignSelf: 'flex-end', mb: 0.5 }}>
            {day}
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', width: '100%' }}>
            {eventsForDay.slice(0, 2).map(event => (
              <Typography
                key={event.id}
                variant="caption"
                display="block"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  p: '2px 4px',
                  borderRadius: '4px',
                  mb: '2px',
                  fontSize: '0.65rem',
                  cursor: 'pointer',
                }}
                onClick={() => handleEventInteraction(event)}
              >
                {event.title}
              </Typography>
            ))}
            {eventsForDay.length > 2 && (
              <Typography variant="caption" sx={{ fontSize: '0.6rem', textAlign: 'center', mt: 0.5, color: eventsForDay.length > 0 ? 'text.secondary' : 'grey.400' }}>
                +{eventsForDay.length - 2} more
              </Typography>
            )}
          </Box>
        </Paper>
      );
    }

    const totalGridCells = Math.ceil((startDayOffset + daysInMonth) / 7) * 7;
    const cellsToFill = Math.min(totalGridCells, 42); // Max 6 weeks

    while (cells.length < cellsToFill) {
      cells.push(
        <Paper
          variant="outlined"
          square
          key={`empty-end-${cells.length}`}
          sx={{
            minHeight: { xs: 100, sm: 120, md: 140 },
            p: 1,
            boxSizing: 'border-box',
            bgcolor: 'grey.50',
            border: '1px solid transparent',
          }}
        />
      );
    }

    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
          {dayLabels.map(dayName => (
            <Typography
              key={dayName}
              variant="caption"
              sx={{ textAlign: 'center', p: { xs: 0.5, sm: 1 }, color: 'text.secondary', fontWeight: 'medium' }}
            >
              {dayName}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: { xs: 0.5, sm: 1 } }}>
          {cells}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LandingNav />
      <Box sx={{
          flexGrow: 1,
          bgcolor: "#D2E4FF",
          p: { xs: 1, sm: 2, md: 3 }
      }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            overflow: 'visible',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Button
              variant="contained"
              onClick={handleCreateButtonClick}
              size="small" // Added to make the button smaller
              sx={{ width: 'auto', minWidth: 'auto', px: 2 }} // Ensures width is based on content, less padding
            >
              + Create
            </Button>
            <Stack direction="row" spacing={1} alignItems="center">
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="calendar view"
                size="small"
              >
                <ToggleButton value="day" aria-label="day view">Day</ToggleButton>
                <ToggleButton value="month" aria-label="month view">Month</ToggleButton>
              </ToggleButtonGroup>
              <Typography variant="h6" component="div" sx={{ textAlign: 'center', minWidth: '180px' }}>
                {view === 'day'
                  ? currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: view === 'day' ? 'auto' : 'hidden' }}>
            {view === 'day' && (
              <Box sx={{ display: 'flex', pb: 2 }}>
                <Box sx={{ minWidth: '80px', pr: 1 }}>
                  <Box sx={{ height: '40px', mb: 1 }} /> {/* Spacer for room headers */}
                  {timeSlots.map(time => (
                    <Box key={time} sx={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 1, borderTop: '1px solid', borderColor: 'divider', '&:first-of-type': { borderTop: 'none' } }}>
                      <Typography variant="caption" color="text.secondary">{time}</Typography>
                    </Box>
                  ))}
                </Box>
                {rooms.map(room => (
                  <Box key={room} sx={{ minWidth: '200px', flex: '1 1 0px', borderLeft: '1px solid', borderColor: 'divider' }}>
                    <Paper variant="outlined" square sx={{ textAlign: 'center', p: 1, height: '40px', mb:1, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>{room}</Typography>
                    </Paper>
                    <Box sx={{ position: 'relative', height: `${timeSlots.length * 60}px` }}>
                      {events
                        .filter(event => {
                            if (event.room !== room) return false;
                            if (event.date === currentDate.toISOString().split('T')[0] && !event.recurrenceRule) {
                                return true;
                            }
                            if (event.recurrenceRule && event.date === currentDate.toISOString().split('T')[0]) {
                                // This is a simplification. Proper recurrence calculation is needed here.
                                return true;
                            }
                            return false;
                        })
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
                            <Typography variant="body2" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</Typography>
                            <Typography variant="caption" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{`${event.startTime} - ${event.endTime}`}</Typography>
                          </Paper>
                        ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            {view === 'month' && renderMonthView()}
          </Box>
        </Paper>
      </Box>

      <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          onMouseEnter: () => { /* Keep popover open if mouse enters it */ },
          onMouseLeave: handlePopoverClose, // Close popover if mouse leaves it
        }}
      >
        <Box sx={{ p: 2, minWidth: 250, maxWidth: 350 }}>
          {popoverDate && (
            <Typography variant="h6" gutterBottom>
              Events for {popoverDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </Typography>
          )}
          <List dense>
            {popoverEvents.map(event => (
              <ListItem key={event.id} disablePadding>
                <Link
                  component="button"
                  onClick={() => {
                    handleEventInteraction(event);
                    handlePopoverClose();
                  }}
                  sx={{ width: '100%', textAlign: 'left', p:0, textDecoration: 'none', color: 'inherit', '&:hover': { backgroundColor: 'action.hover'}, padding: '8px' }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={`${event.startTime} - ${event.endTime} (${event.room})`}
                    primaryTypographyProps={{ sx: { fontWeight: 'medium' } }}
                  />
                </Link>
              </ListItem>
            ))}
            {popoverEvents.length === 0 && popoverDate && ( // Ensure popoverDate is also checked
              <ListItemText primary="No events for this day." />
            )}
          </List>
        </Box>
      </Popover>

      <Dialog open={isBookingFormOpen} onClose={handleCloseBookingForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>{editingEvent?.id ? 'Edit Booking' : 'Create Booking'}</DialogTitle>
        <DialogContent>
          <BookingForm
            rooms={rooms}
            onSubmit={handleBookingSubmit}
            onCancel={handleCloseBookingForm}
            initialData={editingEvent}
            currentDate={formDate}
          />
        </DialogContent>
      </Dialog>
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
  return `${durationMinutes}px`;
};

export default Calendar;