// src/views/PublicCalendar.tsx
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { CalendarEvent } from '../../components/CalendarEvents';
import { getBookings } from '../../services/bookingService';

const PublicCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

// In PublicCalendar.tsx
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const bookings = await getBookings();
      setEvents(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };
  fetchBookings();
}, [currentDate]);

  return (
    <div className="p-4">
      <Calendar 
        events={events}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
    </div>
  );
};

export default PublicCalendar;