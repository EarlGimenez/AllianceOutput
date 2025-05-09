import React, { useState } from 'react';
import Calendar from './Calendar';
import { CalendarEvent } from '../../components/CalendarEvents';

const PublicCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

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