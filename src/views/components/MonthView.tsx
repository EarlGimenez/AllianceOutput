import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { CalendarEvent, Room } from './CalendarEvents';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  rooms: Room[];
  onDayClick: (date: Date) => void;
  onEventHover: (event: React.MouseEvent<HTMLElement>, events: CalendarEvent[], date: Date) => void;
  generateBookingColor: (id: string, alpha?: number) => string;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  rooms,
  onDayClick,
  onEventHover,
  generateBookingColor,
}) => {
  const dayLabelsShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const displayDate = new Date(date);
      
      if (!event.recurrenceRule) {
        return eventDate.toDateString() === displayDate.toDateString();
      }

      const rule = event.recurrenceRule;
      const freqMatch = rule.match(/FREQ=([A-Z]+)/);
      const freq = freqMatch ? freqMatch[1] : 'DAILY';
      
      const byDayMatch = rule.match(/BYDAY=([A-Z,]+)/);
      const days = byDayMatch ? byDayMatch[1].split(',') : [];
      
      const untilMatch = rule.match(/UNTIL=([0-9]{8}T[0-9]{6}Z)/);
      const untilDate = untilMatch ? new Date(
        untilMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')
      ) : null;

      if (displayDate < eventDate) return false;
      if (untilDate && displayDate > untilDate) return false;

      if (freq === 'DAILY') {
        return true;
      } else if (freq === 'WEEKLY') {
        const currentDay = ['SU','MO','TU','WE','TH','FR','SA'][displayDate.getDay()];
        return days.length === 0 || days.includes(currentDay);
      } else if (freq === 'MONTHLY') {
        return displayDate.getDate() === eventDate.getDate();
      }

      return false;
    });
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOffset = firstDayOfMonth.getDay();
    const cells = [];

    // Empty cells for days before the first of the month
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

    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const isCurrentSelectedDate = cellDate.toDateString() === currentDate.toDateString();
      const eventsForDay = getEventsForDate(cellDate);

      cells.push(
        <Paper
          elevation={isCurrentSelectedDate ? 4 : 1}
          square
          key={`day-${day}`}
          onClick={() => onDayClick(cellDate)}
          onMouseEnter={(e) => eventsForDay.length > 0 && onEventHover(e, eventsForDay, cellDate)}
          sx={{
            minHeight: { xs: 80, sm: 100, md: 120 },
            p: 1,
            boxSizing: 'border-box',
            bgcolor: isCurrentSelectedDate ? 'primary.light' : (eventsForDay.length > 0 ? 'action.hover' : 'background.paper'),
            color: isCurrentSelectedDate ? 'primary.contrastText' : 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            cursor: 'pointer',
            border: isCurrentSelectedDate ? '2px solid primary.main' : `1px solid divider`,
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              bgcolor: isCurrentSelectedDate ? 'primary.main' : 'secondary.light',
              color: isCurrentSelectedDate ? 'primary.contrastText' : 'secondary.contrastText',
              borderColor: isCurrentSelectedDate ? 'primary.dark' : 'secondary.main',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 'bold', 
            alignSelf: 'flex-end', 
            mb: 0.5, 
            color: isCurrentSelectedDate ? 'inherit' : 'text.secondary' 
          }}>
            {day}
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', width: '100%' }}>
            {eventsForDay.map(event => {
                const room = rooms.find(r => r.id === event.roomId); // Ensure this matches your calendar events
                return (
                    <Typography
                    key={event.id}
                    variant="caption"
                    display="block"
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        bgcolor: generateBookingColor(event.id),
                        color: 'white',
                        p: '2px 4px',
                        borderRadius: '4px',
                        mb: '2px',
                    }}
                    >
                    {event.title} ({room?.name || 'Unknown Room'})
                    </Typography>
                );
            })}

            {eventsForDay.length > 2 && (
              <Typography variant="caption" sx={{ 
                fontSize: '0.6rem', 
                textAlign: 'center', 
                mt: 0.5, 
                color: isCurrentSelectedDate ? 'inherit' : 'text.secondary' 
              }}>
                +{eventsForDay.length - 2} more
              </Typography>
            )}
          </Box>
        </Paper>
      );
    }

    return cells;
  };

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {dayLabelsShort.map(dayName => (
          <Typography
            key={dayName}
            variant="caption"
            sx={{ 
              textAlign: 'center', 
              p: { xs: 0.5, sm: 1 }, 
              color: 'text.secondary', 
              fontWeight: 'medium' 
            }}
          >
            {dayName}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: { xs: 0.5, sm: 1 } }}>
        {renderMonthView()}
      </Box>
    </Box>
  );
};

export default MonthView;