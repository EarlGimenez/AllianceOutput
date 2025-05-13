export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  room: Room;
  description?: string; // Add this line
  recurrenceRule?: string; // Add this line (e.g., "RRULE:FREQ=WEEKLY;BYDAY=MO,TU;UNTIL=20251231")
  // any other existing fields
}
export type Room = 
  | 'Meeting Room' 
  | 'School Classroom' 
  | 'Professional Studio' 
  | 'Science Lab' 
  | 'Coworking Space';