export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // Format: "HH:mm" e.g. "09:30"
  endTime: string;   // Format: "HH:mm" e.g. "10:30"
  room: Room;
  date: string;      // Format: "YYYY-MM-DD"
  description?: string;
}

export type Room = 
  | 'Meeting Room' 
  | 'School Classroom' 
  | 'Professional Studio' 
  | 'Science Lab' 
  | 'Coworking Space';