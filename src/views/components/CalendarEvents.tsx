// CalendarEvents.ts
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  roomId: string; // Changed from room to roomId for consistency
  description?: string;
  userId: string;

  // New, readable recurrence fields.
  recurrenceType?: 'daily' | 'weekly' | 'monthly';
  recurrenceByDay?: string; // Comma-separated, e.g., "MO,TU,WE"
  recurrenceUntil?: string; // ISO Date string, e.g., "2025-06-17"

  // Kept for backward compatibility with existing data.
  recurrenceRule?: string;
}

export interface Room {
  id: string; // Ensure each Room has a unique id
  name: string;
  location: string;
  timeStart: string;
  timeEnd: string;
  image: string;
}