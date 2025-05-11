import React from 'react';
import { CalendarEvent, Room } from './CalendarEvents';
// import Button from './Button'; // Removed since Button component is no longer available

// Simple Button component to replace the missing Button import
interface SimpleButtonProps {
  variant?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const CustomButton: React.FC<SimpleButtonProps> = ({ 
  variant, 
  onClick, 
  children, 
  className 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`custom-button ${variant === 'default' ? 'default' : ''} ${className || ''}`}
    >
      {children}
    </button>
  );
};

interface CalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onAddEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  currentDate,
  onDateChange
}) => {
  const rooms: Room[] = [
    'Meeting Room',
    'School Classroom',
    'Professional Studio', 
    'Science Lab',
    'Coworking Space'
  ];

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i; // Start from 8 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        {onAddEvent && (
          <CustomButton 
            variant="default"
            onClick={onAddEvent}
          >
            + Create
          </CustomButton>
        )}
        <div className="date-navigator">
          <div className="current-date">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </header>

      <div className="calendar-grid">
        <div className="time-column">
          {timeSlots.map(time => (
            <div key={time} className="time-slot">
              {time}
            </div>
          ))}
        </div>

        {rooms.map(room => (
          <div key={room} className="room-column">
            <div className="room-header">{room}</div>
            <div className="room-events">
              {events
                .filter(event => event.room === room)
                .map(event => (
                  <div 
                    key={event.id}
                    className="event-card"
                    style={{
                      top: calculateEventPosition(event.startTime),
                      height: calculateEventHeight(event.startTime, event.endTime)
                    }}
                    onClick={() => onEditEvent?.(event)}
                  >
                    <h3>{event.title}</h3>
                    <p>{`${event.startTime} - ${event.endTime}`}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const calculateEventPosition = (startTime: string): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = (hours - 8) * 60 + minutes;
  return `${totalMinutes}px`;
};

const calculateEventHeight = (startTime: string, endTime: string): string => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const durationMinutes = 
    (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  return `${durationMinutes}px`;
};

export default Calendar;