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
  DialogActions, // Added DialogActions
  useTheme,
} from '@mui/material';
import { CalendarEvent, Room } from '../../components/CalendarEvents';
import { LandingNav } from '../../components/LandingNav';
import BookingForm from '../../components/BookingForm';

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
  onDeleteEvent: parentOnDeleteEvent,
  currentDate: passedCurrentDate,
  onDateChange,
}) => {
  const theme = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [internalCurrentDate, setInternalCurrentDate] = useState(passedCurrentDate || new Date());

  const currentDate = onDateChange ? passedCurrentDate : internalCurrentDate;
  const setCurrentDate = (newDate: Date) => {
    if (onDateChange) {
      onDateChange(newDate);
    } else {
      setInternalCurrentDate(newDate);
    }
  };

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    if (!onDateChange) {
      setInternalCurrentDate(passedCurrentDate || new Date());
    }
  }, [passedCurrentDate, onDateChange]);

  const rooms: Room[] = [
    'Meeting Room',
    'School Classroom',
    'Professional Studio',
    'Science Lab',
    'Coworking Space',
  ];

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  const dayLabelsShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [view, setView] = useState<'day' | 'month'>('day');
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [formDate, setFormDate] = useState<Date | undefined>(currentDate);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!editingEvent) {
      setFormDate(currentDate);
    }
  }, [currentDate, editingEvent]);

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

  const handleDateNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  const handleOpenBookingForm = (eventToEdit?: CalendarEvent, dateForNew?: Date) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setFormDate(eventToEdit.date ? new Date(eventToEdit.date + 'T00:00:00') : undefined);
    } else {
      setEditingEvent(undefined);
      setFormDate(dateForNew || currentDate);
    }
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setEditingEvent(undefined);
  };

  const handleBookingSubmit = (bookingData: Partial<CalendarEvent>) => {
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

  const handleDayClickInMonthView = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const handleRequestDelete = (eventId: string) => {
    setEventToDeleteId(eventId);
    setDeleteConfirmOpen(true);
    // Close the booking form if it's open for the event being deleted
    if (editingEvent?.id === eventId) {
        handleCloseBookingForm();
    }
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setEventToDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (eventToDeleteId) {
      if (parentOnDeleteEvent) {
        parentOnDeleteEvent(eventToDeleteId);
      } else {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDeleteId));
      }
      handleCloseDeleteConfirm();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (view !== 'month' || isBookingFormOpen || popoverAnchorEl || deleteConfirmOpen) return;

      let newDate = new Date(currentDate);
      let dateChanged = false;

      switch (event.key) {
        case 'ArrowLeft':
          newDate.setDate(newDate.getDate() - 1);
          dateChanged = true;
          break;
        case 'ArrowRight':
          newDate.setDate(newDate.getDate() + 1);
          dateChanged = true;
          break;
        case 'ArrowUp':
          newDate.setDate(newDate.getDate() - 7);
          dateChanged = true;
          break;
        case 'ArrowDown':
          newDate.setDate(newDate.getDate() + 7);
          dateChanged = true;
          break;
        case 'Enter':
          setView('day');
          event.preventDefault();
          return;
        default:
          return;
      }

      if (dateChanged) {
        event.preventDefault();
        setCurrentDate(newDate);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [view, currentDate, setCurrentDate, isBookingFormOpen, popoverAnchorEl, deleteConfirmOpen]);

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOffset = firstDayOfMonth.getDay();
    const cells = [];

    for (let i = 0; i < startDayOffset; i++) {
      cells.push(
        <Paper
          variant="outlined"
          square
          key={`empty-start-${i}`}
          sx={{
            minHeight: { xs: 80, sm: 100, md: 120 },
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
      const isCurrentSelectedDate = cellDate.toDateString() === currentDate.toDateString();

      const eventsForDay = events.filter(event => {
        const currentDisplayDate = cellDate;

        if (!event.recurrenceRule) {
          return event.date === currentDisplayDate.toISOString().split('T')[0];
        }

        const eventSeriesStartDate = new Date(event.date);
        eventSeriesStartDate.setHours(0, 0, 0, 0);

        const currentDisplayDayStart = new Date(currentDisplayDate);
        currentDisplayDayStart.setHours(0, 0, 0, 0);

        if (currentDisplayDayStart < eventSeriesStartDate) {
          return false;
        }

        const untilMatch = event.recurrenceRule.match(/UNTIL=([0-9]{8}T[0-9]{6}Z)/);
        if (untilMatch && untilMatch[1]) {
          const untilDateString = untilMatch[1];
          const recurrenceEndDateUtc = new Date(
            untilDateString.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')
          );
          if (currentDisplayDayStart > recurrenceEndDateUtc) {
            return false;
          }
        }

        if (event.recurrenceRule.includes('FREQ=DAILY')) {
          return true;
        }

        if (event.recurrenceRule.includes('FREQ=WEEKLY')) {
          const byDayMatch = event.recurrenceRule.match(/BYDAY=([A-Z,]+)/);
          const currentDayOfWeekShort = dayLabelsShort[currentDisplayDayStart.getDay()].substring(0, 2).toUpperCase();

          if (byDayMatch && byDayMatch[1]) {
            const ruleDays = byDayMatch[1].split(',');
            return ruleDays.includes(currentDayOfWeekShort);
          } else {
            return currentDisplayDayStart.getDay() === eventSeriesStartDate.getDay();
          }
        }

        if (event.recurrenceRule.includes('FREQ=MONTHLY')) {
          return currentDisplayDayStart.getDate() === eventSeriesStartDate.getDate();
        }
        
        return false;
      });

      cells.push(
        <Paper
          elevation={isCurrentSelectedDate ? 4 : 1}
          square
          key={`day-${day}`}
          aria-owns={openPopover && popoverDate?.getTime() === cellDate.getTime() ? popoverId : undefined}
          aria-haspopup="true"
          onMouseEnter={(e) => eventsForDay.length > 0 && handlePopoverOpen(e, eventsForDay, cellDate)}
          onClick={() => handleDayClickInMonthView(cellDate)}
          sx={{
            minHeight: { xs: 80, sm: 100, md: 120 },
            p: 1,
            boxSizing: 'border-box',
            bgcolor: isCurrentSelectedDate ? theme.palette.primary.light : (eventsForDay.length > 0 ? theme.palette.action.hover : theme.palette.background.paper),
            color: isCurrentSelectedDate ? theme.palette.primary.contrastText : theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            cursor: 'pointer',
            border: isCurrentSelectedDate ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              bgcolor: isCurrentSelectedDate ? theme.palette.primary.main : theme.palette.secondary.light,
              color: isCurrentSelectedDate ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
              borderColor: isCurrentSelectedDate ? theme.palette.primary.dark : theme.palette.secondary.main,
            },
            transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', alignSelf: 'flex-end', mb: 0.5, color: isCurrentSelectedDate ? 'inherit' : 'text.secondary' }}>
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
                  bgcolor: isCurrentSelectedDate ? 'rgba(255,255,255,0.2)' : theme.palette.primary.main,
                  color: isCurrentSelectedDate ? 'inherit' : theme.palette.primary.contrastText,
                  p: '2px 4px',
                  borderRadius: '4px',
                  mb: '2px',
                  fontSize: '0.65rem',
                }}
              >
                {event.title}
              </Typography>
            ))}
            {eventsForDay.length > 2 && (
              <Typography variant="caption" sx={{ fontSize: '0.6rem', textAlign: 'center', mt: 0.5, color: isCurrentSelectedDate ? 'inherit' : 'text.secondary' }}>
                +{eventsForDay.length - 2} more
              </Typography>
            )}
          </Box>
        </Paper>
      );
    }

    const totalGridCells = Math.max(35, Math.ceil((startDayOffset + daysInMonth) / 7) * 7);
    while (cells.length < totalGridCells) {
      cells.push(
        <Paper
          variant="outlined"
          square
          key={`empty-end-${cells.length}`}
          sx={{
            minHeight: { xs: 80, sm: 100, md: 120 },
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
          {dayLabelsShort.map(dayName => (
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
            spacing={{xs: 1, sm: 2}}
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Button
              variant="contained"
              onClick={handleCreateButtonClick}
              size="small"
              sx={{ width: 'auto', minWidth: 'auto', px: 2, order: {xs: 3, sm: 1} }}
            >
              + Create
            </Button>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ order: {xs: 1, sm: 2}, flexGrow: {xs: 1, sm: 0}, justifyContent: 'center' }}>
              <Button onClick={() => handleDateNavigate('prev')} size="small">{'<'}</Button>
              <Typography variant="h6" component="div" sx={{ textAlign: 'center', minWidth: {xs: '150px', sm:'180px'}, userSelect: 'none' }}>
                {view === 'day'
                  ? currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Typography>
              <Button onClick={() => handleDateNavigate('next')} size="small">{'>'}</Button>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ order: {xs: 2, sm: 3}}}>
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
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: view === 'day' ? 'auto' : 'hidden' }}>
            {view === 'day' && (
              <Box sx={{ display: 'flex', pb: 2 }}>
                <Box sx={{ minWidth: '80px', pr: 1 }}>
                  <Box sx={{ height: '40px', mb: 1 }} />
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
                            
                            const currentDisplayDate = currentDate;

                            if (!event.recurrenceRule) {
                              return event.date === currentDisplayDate.toISOString().split('T')[0];
                            }

                            const eventSeriesStartDate = new Date(event.date);
                            eventSeriesStartDate.setHours(0, 0, 0, 0); 

                            const currentDisplayDayStart = new Date(currentDisplayDate);
                            currentDisplayDayStart.setHours(0, 0, 0, 0);

                            if (currentDisplayDayStart < eventSeriesStartDate) {
                              return false; 
                            }

                            const untilMatch = event.recurrenceRule.match(/UNTIL=([0-9]{8}T[0-9]{6}Z)/);
                            if (untilMatch && untilMatch[1]) {
                              const untilDateString = untilMatch[1];
                              const recurrenceEndDateUtc = new Date(
                                untilDateString.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')
                              );
                              if (currentDisplayDayStart > recurrenceEndDateUtc) {
                                return false;
                              }
                            }

                            if (event.recurrenceRule.includes('FREQ=DAILY')) {
                              return true;
                            }

                            if (event.recurrenceRule.includes('FREQ=WEEKLY')) {
                              const byDayMatch = event.recurrenceRule.match(/BYDAY=([A-Z,]+)/);
                              const currentDayOfWeekShort = dayLabelsShort[currentDisplayDayStart.getDay()].substring(0, 2).toUpperCase();
                              if (byDayMatch && byDayMatch[1]) {
                                const ruleDays = byDayMatch[1].split(',');
                                return ruleDays.includes(currentDayOfWeekShort);
                              } else {
                                return currentDisplayDayStart.getDay() === eventSeriesStartDate.getDay();
                              }
                            }
                            
                            if (event.recurrenceRule.includes('FREQ=MONTHLY')) {
                                return currentDisplayDayStart.getDate() === eventSeriesStartDate.getDate();
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
          onMouseEnter: () => { /* Keep popover open */ },
          onMouseLeave: handlePopoverClose,
          sx: { pointerEvents: 'auto' }
        }}
        disableRestoreFocus
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
                  sx={{ width: '100%', textAlign: 'left', textDecoration: 'none', color: 'inherit', '&:hover': { backgroundColor: 'action.hover'}, borderRadius:1, padding: '8px' }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={`${event.startTime} - ${event.endTime} (${event.room})`}
                    primaryTypographyProps={{ sx: { fontWeight: 'medium' } }}
                  />
                </Link>
              </ListItem>
            ))}
            {popoverEvents.length === 0 && popoverDate && (
              <ListItem>
                <ListItemText primary="No events for this day." />
              </ListItem>
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
            onDelete={handleRequestDelete} // Pass the delete handler
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

export default Calendar;