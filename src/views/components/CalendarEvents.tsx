// CalendarEvents.ts
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  roomId: string; // Changed from room to roomId for consistency
  description?: string;
  recurrenceRule?: string;
  userId: string;
}

export interface Room {
  id: string; // Ensure each Room has a unique id
  name: string;
  location: string;
  timeStart: string;
  timeEnd: string;
  image: string;
}
