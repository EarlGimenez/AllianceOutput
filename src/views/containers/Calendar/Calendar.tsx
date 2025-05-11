// ...existing code...
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Button,
  Popover, // Import Popover
  List,     // For listing events in Popover
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote'; // Example icon for events
// import Button from '../../components/Button'; // Your custom Button
import { CalendarEvent, Room } from '../../components/CalendarEvents';
import { LandingNav } from '../../components/LandingNav';
// To potentially add a footer later, you might import:
// import { SiteFooter } from '../../components/SiteFooter';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  currentDate: Date;
  onDateChange?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  currentDate,
}) => {
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

  // State for Popover
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);

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
    // Optionally clear popoverEvents and popoverDate after a delay or on transition end
    // For now, clear immediately for simplicity
    // setPopoverEvents([]);
    // setPopoverDate(null);
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
            minHeight: { xs: 100, sm: 120, md: 140 }, // Increased minHeight for event text
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
      const cellDateString = cellDate.toISOString().split('T')[0]; // YYYY-MM-DD for comparison

      const eventsForDay = events.filter(event => event.date === cellDateString);

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
            minHeight: { xs: 100, sm: 120, md: 140 }, // Increased minHeight
            p: 1,
            boxSizing: 'border-box',
            bgcolor: eventsForDay.length > 0 ? '#e3f2fd' : '#0d47a1', // Lighter blue if events, else dark blue
            color: eventsForDay.length > 0 ? 'primary.dark' : 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start', // Align date to top
            cursor: eventsForDay.length > 0 ? 'pointer' : 'default',
            borderRadius: 1,
            position: 'relative', // For absolute positioning of "more events"
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
            {eventsForDay.slice(0, 2).map(event => ( // Show max 2 events directly
              <Typography
                key={event.id}
                variant="caption"
                display="block"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  bgcolor: 'primary.main', // Or a specific event color
                  color: 'primary.contrastText',
                  p: '2px 4px',
                  borderRadius: '4px',
                  mb: '2px',
                  fontSize: '0.65rem',
                }}
                onClick={() => onEditEvent?.(event)} // Allow clicking event in cell
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
    const cellsToFill = Math.min(totalGridCells, 42);

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
      {/* This Box provides the blue background for the main content area */}
      <Box sx={{ 
          flexGrow: 1, 
          bgcolor: "#1e5393", // Your desired blue background color
          p: { xs: 1, sm: 2, md: 3 } // Padding around the Paper, creates the blue "border"
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, md: 3 }, // Inner padding of the Paper
            overflow: 'visible', 
            // m: { xs: 1, sm: 2, md: 3 }, // Margin removed, parent Box padding handles spacing
            height: '100%', // Make Paper fill the blue Box
            display: 'flex', // Added to allow flexGrow on child
            flexDirection: 'column' // Added to stack children vertically
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            {onAddEvent && (
              <Button 
                variant="contained"
                onClick={onAddEvent} 
                className="w-full sm:w-auto"
              >
                + Create
              </Button>
            )}
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

          {/* This Box will contain the scrollable calendar grid and take remaining space */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: view === 'day' ? 'auto' : 'hidden' }}>
            {view === 'day' && (
              <Box sx={{ display: 'flex', pb: 2 /* Removed flexGrow from here */ }}>
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
                        .filter(event => event.room === room && event.date === currentDate.toISOString().split('T')[0]) // Ensure day view also filters by current date
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
                            onClick={() => onEditEvent?.(event)}
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

      {/* Popover for displaying events on a specific day */}
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
          onMouseLeave: handlePopoverClose, // Close if mouse leaves popover
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
                    onEditEvent?.(event);
                    handlePopoverClose();
                  }}
                  sx={{ width: '100%', textAlign: 'left', p:0, textDecoration: 'none' }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={`${event.startTime} - ${event.endTime} (${event.room})`}
                    primaryTypographyProps={{ sx: { fontWeight: 'medium' } }}
                  />
                </Link>
              </ListItem>
            ))}
            {popoverEvents.length === 0 && (
              <ListItemText primary="No events for this day." />
            )}
          </List>
          {/* Optionally, add a button to create a new event for this day */}
          {/* <Button size="small" onClick={() => { onAddEvent?.(popoverDate); handlePopoverClose(); }} sx={{mt: 1}}>
            Add Event
          </Button> */}
        </Box>
      </Popover>
    </Box>
  );
};

const calculateEventPosition = (startTime: string): string => {
// ...existing code...
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