import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { CalendarEvent } from '../../components/CalendarEvents';
import { getBookings } from '../../services/bookingService';

const PublicCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await getBookings();
        setEvents(bookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    };
    fetchBookings();
  }, [currentDate]);

  return (
    <div style={{ height: '100vh' }}>
      <Calendar 
        events={events}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
    </div>
  );
};

export default PublicCalendar;