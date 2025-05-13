import React, { useState } from 'react';
import Calendar from '../Calendar/Calendar'; // Corrected import path
import { CalendarEvent } from '../../components/CalendarEvents';

const UserCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAddEvent = (newEventData: Partial<CalendarEvent>) => {
    const newEventWithId: CalendarEvent = {
      ...newEventData,
      id: Date.now().toString(), // Ensure new events get a unique ID
      date: newEventData.date!,
      startTime: newEventData.startTime!,
      endTime: newEventData.endTime!,
      room: newEventData.room!,
      title: newEventData.title!,
    };
    setEvents(prevEvents => [...prevEvents, newEventWithId]);
  };

  const handleEditEvent = (updatedEvent: CalendarEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event)
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  return (
    // Consider removing p-4 if Calendar's internal padding is sufficient, or adjust as needed
    <div> 
      <Calendar 
        events={events}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default UserCalendar;