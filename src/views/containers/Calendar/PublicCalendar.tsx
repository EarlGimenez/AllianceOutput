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

  const handleAddEvent = async (newEvent: CalendarEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleEditEvent = async (updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleDeleteEvent = async (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div style={{ height: '100vh' }}>
      <Calendar 
        events={events}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        parentOnAddEvent={handleAddEvent}
        parentOnEditEvent={handleEditEvent}
        parentOnDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default PublicCalendar;