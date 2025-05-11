import React, { useState } from 'react';
import Calendar from '../../components/Calendar';
import { CalendarEvent } from '../../components/CalendarEvents';

const UserCalendar = () => {
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

export default UserCalendar;