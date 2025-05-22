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
