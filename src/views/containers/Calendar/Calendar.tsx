import React, { useState } from 'react';
import {
  Box,
  Typography,
  // Grid, // Grid is not used, so it can be removed
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import Button from '../../components/Button'; // Your custom Button
import { CalendarEvent, Room } from '../../components/CalendarEvents';
import { LandingNav } from '../../components/LandingNav'; // Import LandingNav
// To potentially add a footer later, you might import:
// import { SiteFooter } from '../../components/SiteFooter';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  // To control the view (day/month) if these buttons are to be functional
  // currentView?: 'day' | 'month';
  // onViewChange?: (view: 'day' | 'month') => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  // onDeleteEvent, // Not used in this specific rendering, but kept for prop consistency
  currentDate,
  // onDateChange, // Not used in this specific rendering for date navigation buttons
  // currentView = 'day', // Default view
  // onViewChange,
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

  // Placeholder for view state if you make Day/Month buttons functional
  const [view, setView] = useState<'day' | 'month'>('day');

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'day' | 'month' | null,
  ) => {
    if (newView !== null) {
      setView(newView);
      // if (onViewChange) {
      //   onViewChange(newView);
      // }
    }
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOffset = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday ...

    const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const cells = [];

    // Add empty cells for days before the first of the month
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
            bgcolor: 'grey.50', // Lighter background for empty cells
            border: '1px solid transparent', // To maintain grid structure if needed
          }}
        />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      // Placeholder: In a real app, filter events for this cellDate
      // const eventsForDay = events.filter(event => event.date === cellDate.toISOString().split('T')[0]);
      // const reservedCount = eventsForDay.length;
      // const availableCount = 4 - reservedCount; // Example logic

      cells.push(
        <Paper
          // variant="outlined" // The image shows solid color cells
          elevation={1} // Slight elevation for a bit of depth
          square
          key={`day-${day}`}
          sx={{
            minHeight: { xs: 80, sm: 100, md: 120 },
            p: 1,
            boxSizing: 'border-box',
            bgcolor: '#0d47a1', // Dark blue, adjust as needed (e.g., theme.palette.primary.dark)
            color: 'white', // (e.g. theme.palette.primary.contrastText)
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Pushes content to top and bottom
            cursor: 'pointer',
            borderRadius: 1, // Slight rounding as in image
            '&:hover': {
              bgcolor: '#1565c0', // Slightly lighter blue on hover
            },
          }}
          // onClick={() => console.log('Clicked on', cellDate)} // Optional: handle day click
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
          <Box sx={{ mt: 'auto' }}> {/* Pushes this content to the bottom */}
            <Typography variant="caption" display="block">4 Available</Typography> {/* Placeholder */}
            <Typography variant="caption" display="block">1 Reserved</Typography> {/* Placeholder */}
            {/* Example for discount:
            {day % 5 === 0 && ( // Just an example condition
              <Typography variant="caption" display="block" sx={{ color: 'warning.light' }}>
                @ 20% off
              </Typography>
            )}
            */}
          </Box>
        </Paper>
      );
    }
    
    // Add empty cells to fill the last week for a consistent grid (up to 6 weeks = 42 cells)
    const totalGridCells = Math.ceil((startDayOffset + daysInMonth) / 7) * 7;
    // Ensure we don't exceed 42 cells (6 weeks * 7 days)
    const cellsToFill = Math.min(totalGridCells, 42);

    while (cells.length < cellsToFill) {
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
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}> {/* Padding around the month view content */}
        {/* Day of the week headers */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
          {dayLabels.map(dayName => (
            <Typography
              key={dayName}
              variant="caption"
              sx={{
                textAlign: 'center',
                p: { xs: 0.5, sm: 1 },
                color: 'text.secondary',
                fontWeight: 'medium',
              }}
            >
              {dayName}
            </Typography>
          ))}
        </Box>

        {/* Days grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: { xs: 0.5, sm: 1 }, // Gap between cells
            // border: '1px solid', // Optional: border around the whole grid
            // borderColor: 'divider',
            // bgcolor: 'grey.100', // Optional: background for the grid area if cells don't fill it
          }}
        >
          {cells}
        </Box>
      </Box>
    );
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LandingNav />
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          overflow: 'visible', // Changed from 'hidden' to allow shadows if any
          flexGrow: 1, // Allows the paper to take available vertical space
          m: { xs: 1, sm: 2, md: 3 } // Adds some margin around the calendar content
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
            <Button variant="default" onClick={onAddEvent} className="w-full sm:w-auto">
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
              <ToggleButton value="day" aria-label="day view">
                Day
              </ToggleButton>
              <ToggleButton value="month" aria-label="month view">
                Month
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="h6" component="div" sx={{ textAlign: 'center', minWidth: '180px' }}>
              {view === 'day'
                ? currentDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : currentDate.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {view === 'day' && (
          <Box sx={{ display: 'flex', overflowX: 'auto', pb: 2 }}>
            {/* Time Column */}
            <Box sx={{ minWidth: '80px', pr: 1 }}>
              <Box sx={{ height: '40px' /* Room header spacer */, mb: 1 }} /> {/* Spacer for room headers */}
              {timeSlots.map(time => (
                <Box
                  key={time}
                  sx={{
                    height: '60px', // Adjust height as needed
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    pr: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    '&:first-of-type': { borderTop: 'none' }
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {time}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Room Columns */}
            {rooms.map(room => (
              <Box key={room} sx={{ minWidth: '200px', flex: '1 1 0px', borderLeft: '1px solid', borderColor: 'divider' }}>
                <Paper
                  variant="outlined"
                  square
                  sx={{
                    textAlign: 'center',
                    p: 1,
                    height: '40px',
                    mb:1,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                    {room}
                  </Typography>
                </Paper>
                <Box sx={{ position: 'relative', height: `${timeSlots.length * 60}px` /* Total height of time slots */ }}>
                  {events
                    .filter(event => event.room === room) // Add date filter if necessary: && event.date === currentDate.toISOString().split('T')[0]
                    .map(event => (
                      <Paper
                        elevation={2}
                        key={event.id}
                        sx={{
                          position: 'absolute',
                          left: '4px',
                          right: '4px',
                          top: calculateEventPosition(event.startTime),
                          height: calculateEventHeight(event.startTime, event.endTime),
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          p: 1,
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        }}
                        onClick={() => onEditEvent?.(event)}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {event.title}
                        </Typography>
                        <Typography variant="caption" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {`${event.startTime} - ${event.endTime}`}
                        </Typography>
                      </Paper>
                    ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
        {view === 'month' && renderMonthView()}
      </Paper>
      {/* <SiteFooter /> */} {/* You can add this if you want a footer as well */}
    </Box>
  );
};

// Helper functions for positioning events (assuming 1px per minute, starting from 8 AM)
// And each time slot visual height is 60px
const calculateEventPosition = (startTime: string): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutesFrom8AM = (hours - 8) * 60 + minutes;
  // Assuming each 60px slot represents an hour.
  // If a slot is 60px high, then each minute is 1px.
  return `${totalMinutesFrom8AM}px`;
};

const calculateEventHeight = (startTime: string, endTime: string): string => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const durationMinutes =
    (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  return `${durationMinutes}px`;
};

export default Calendar;