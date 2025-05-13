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
      const dateStr = new Date(currentDate).toISOString().split('T')[0];
      const bookings = await getBookings();
      setEvents(bookings.filter(b => {
        // Filter for events that occur on the current month
        const eventDate = new Date(b.date);
        return eventDate.getMonth() === currentDate.getMonth() && 
               eventDate.getFullYear() === currentDate.getFullYear();
      }));
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