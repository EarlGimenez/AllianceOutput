// CalendarEvents.ts
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  roomId: string;
  description?: string;
  recurrenceRule?: string;
  userId: string;
}