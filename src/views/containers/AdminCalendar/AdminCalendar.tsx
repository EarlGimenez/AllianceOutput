import React, { useState } from 'react';
import Calendar from '../Calendar/Calendar';
import { CalendarEvent } from '../../components/CalendarEvents';

export const AdminCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAddEvent = () => {
    // TODO: Implement add event dialog/form
  };

  return (
    <div className="p-4">
      <Calendar 
        events={events}
        currentDate={currentDate}
        onAddEvent={handleAddEvent}
        onEditEvent={(event) => {
          // TODO: Implement edit
        }}
        onDeleteEvent={(eventId) => {
          setEvents(prev => prev.filter(event => event.id !== eventId));
        }}
        onDateChange={setCurrentDate}
      />
    </div>
  );
};

export default AdminCalendar;