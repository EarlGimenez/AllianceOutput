import { CalendarEvent } from "../components/CalendarEvents";

// src/services/bookingService.ts
const API_URL = 'http://localhost:3001/bookings';

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const getBookings = async (date?: string, userId?: string): Promise<CalendarEvent[]> => {
  let url = API_URL;
  const params = new URLSearchParams();
  
  if (date) params.append('date', date);
  if (userId) params.append('userId', userId);
  
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return await response.json();
};

export const createBooking = async (booking: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  // Ensure date is properly formatted
  const correctedBooking = {
    ...booking,
    date: formatDate(booking.date)
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(correctedBooking)
  });
  if (!response.ok) throw new Error('Failed to create booking');
  return await response.json();
};

export const updateBooking = async (id: string, booking: Partial<CalendarEvent>): Promise<CalendarEvent> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  if (!response.ok) throw new Error('Failed to update booking');
  return await response.json();
};

export const deleteBooking = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete booking');
};

export const createRecurringBookings = async (
  baseBooking: Omit<CalendarEvent, 'id'>,
  recurrenceRule: string
): Promise<CalendarEvent[]> => {
  const createdBookings: CalendarEvent[] = [];
  const startDate = new Date(baseBooking.date);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1); // 1 month limit

  // Parse recurrence rule
  const freqMatch = recurrenceRule.match(/FREQ=([A-Z]+)/);
  const freq = freqMatch ? freqMatch[1] : 'DAILY';
  const byDayMatch = recurrenceRule.match(/BYDAY=([A-Z,]+)/);
  const days = byDayMatch ? byDayMatch[1].split(',') : [];

  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Apply recurrence rules
    let shouldCreate = false;
    
    if (freq === 'DAILY') {
      shouldCreate = true;
    } 
    else if (freq === 'WEEKLY' && days.length) {
      const currentDay = ['SU','MO','TU','WE','TH','FR','SA'][currentDate.getDay()];
      shouldCreate = days.includes(currentDay);
    }
    else if (freq === 'MONTHLY') {
      shouldCreate = currentDate.getDate() === startDate.getDate();
    }

    if (shouldCreate) {
      const bookingDate = formatDate(currentDate);
      try {
        const newBooking = await createBooking({
          ...baseBooking,
          date: bookingDate,
          recurrenceRule: bookingDate === baseBooking.date ? recurrenceRule : undefined
        });
        createdBookings.push(newBooking);
      } catch (error) {
        console.error(`Error creating booking for ${bookingDate}:`, error);
      }
    }

    // Move to next date based on frequency
    if (freq === 'DAILY') currentDate.setDate(currentDate.getDate() + 1);
    else if (freq === 'WEEKLY') currentDate.setDate(currentDate.getDate() + 7);
    else if (freq === 'MONTHLY') currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return createdBookings;
};