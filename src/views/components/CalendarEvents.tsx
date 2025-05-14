// In CalendarEvents.tsx
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: Room;
  description?: string;
  recurrenceRule?: string;
  userId: string; // Add this line
}

export type Room = 
  | 'Meeting Room' 
  | 'School Classroom' 
  | 'Professional Studio' 
  | 'Science Lab' 
  | 'Coworking Space';