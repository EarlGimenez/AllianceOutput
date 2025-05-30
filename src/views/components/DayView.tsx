import React from 'react';
import { Box, Paper, Typography, Pagination } from '@mui/material';
import { CalendarEvent } from './CalendarEvents';
import { Room } from '../services/roomService';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  rooms: Room[];
  onEventClick: (event: CalendarEvent) => void;
  generateBookingColor: (id: string, alpha?: number) => string;
  currentPage: number;
  roomsPerPage: number;
  totalRooms: number;
  onPageChange: (page: number) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  rooms,
  onEventClick,
  generateBookingColor,
  currentPage,
  roomsPerPage,
  totalRooms,
  onPageChange,
}) => {
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const dayLabelsShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

const isEventVisible = (event: CalendarEvent, roomId: string, displayDate: Date): boolean => {
    if (event.roomId !== roomId) return false; // Compare roomId instead of room
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0); // Reset the time for accurate comparison
    displayDate.setHours(0, 0, 0, 0); // Reset the time for accurate comparison
    return eventDate.getTime() === displayDate.getTime();
};

const getEventsForDate = (date: Date, roomId: string): CalendarEvent[] => {
    return events.filter(event => {
      if (event.roomId !== roomId) return false;
      
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', pb: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ minWidth: '80px', pr: 1 }}>
            <Box sx={{ height: '40px', mb: 1 }} />
            {timeSlots.map(time => (
              <Box key={time} sx={{ 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end', 
                pr: 1, 
                borderTop: '1px solid', 
                borderColor: 'divider', 
                '&:first-of-type': { borderTop: 'none' } 
              }}>
                <Typography variant="caption" color="text.secondary">{time}</Typography>
              </Box>
            ))}
          </Box>
          {rooms.map(room => (
            <Box key={room.id} sx={{ minWidth: '200px', flex: '1 1 0px', borderLeft: '1px solid', borderColor: 'divider' }}>
              <Paper variant="outlined" square sx={{ 
                textAlign: 'center', 
                p: 1, 
                height: '40px', 
                mb: 1, 
                bgcolor: 'grey.100', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>{room.name}</Typography>
              </Paper>
              <Box sx={{ position: 'relative', height: `${timeSlots.length * 60}px` }}>
                {getEventsForDate(currentDate, room.id).map(event => (
                  <Paper
                    elevation={2}
                    key={event.id}
                    sx={{
                      position: 'absolute',
                      left: '4px',
                      right: '4px',
                      top: calculateEventPosition(event.startTime),
                      height: calculateEventHeight(event.startTime, event.endTime),
                      bgcolor: generateBookingColor(event.id),
                      color: 'white',
                      p: 1,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.9 },
                    }}
                    onClick={() => onEventClick(event)}
                  >
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {`${event.startTime} - ${event.endTime}`}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Pagination
          count={Math.ceil(totalRooms / roomsPerPage)}
          page={currentPage + 1}
          onChange={(e, page) => onPageChange(page - 1)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default DayView;