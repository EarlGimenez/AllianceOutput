import { CalendarEvent } from "../components/CalendarEvents";
import { Room } from "./roomService"

const API_URL = 'https://localhost:59453/api/bookings';

// Helper function to format dates consistently
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Helper function to check time overlaps
const timeRangesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const getMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const s1 = getMinutes(start1);
  const e1 = getMinutes(end1);
  const s2 = getMinutes(start2);
  const e2 = getMinutes(end2);

  return s1 < e2 && s2 < e1;
};

// Helper function to parse recurrence rules
const parseRecurrenceRule = (rule: string) => {
  const freqMatch = rule.match(/FREQ=([A-Z]+)/);
  const byDayMatch = rule.match(/BYDAY=([A-Z,]+)/);
  const untilMatch = rule.match(/UNTIL=([0-9]{8}T[0-9]{6}Z)/);
  
  return {
    freq: freqMatch ? freqMatch[1] : 'DAILY',
    days: byDayMatch ? byDayMatch[1].split(',') : [],
    until: untilMatch ? new Date(
      untilMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')
    ) : null
  };
};

export const getBookings = async (userId?: string): Promise<CalendarEvent[]> => {
  let url = API_URL;
  if (userId) {
    url += `?userId=${userId}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data = await response.json();
    
    // Map backend response to frontend format
    // Backend returns camelCase: bookingId, roomId, userId (not bookingID, roomID, userID)
    return data.map((booking: any) => ({
      id: booking.bookingId,           // Fixed: was booking.bookingID
      title: booking.title,
      date: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      roomId: booking.roomId,          // Fixed: was booking.roomID
      description: booking.description,
      recurrenceRule: booking.recurrenceRule,
      userId: booking.userId           // Fixed: was booking.userID
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const createBooking = async (booking: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  try {
    const userId = localStorage.getItem('userId') || '';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: booking.roomId,        // Changed from roomID - backend now expects camelCase
        userId: userId,                 // Changed from userID
        title: booking.title,
        bookingDate: formatDate(booking.date),
        startTime: booking.startTime,
        endTime: booking.endTime,
        description: booking.description,
        recurrenceRule: booking.recurrenceRule
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    const data = await response.json();
    
    // Map backend response to frontend format
    return {
      id: data.bookingId,
      title: data.title,
      date: data.bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      roomId: data.roomId,
      description: data.description,
      recurrenceRule: data.recurrenceRule,
      userId: data.userId
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBooking = async (id: string, booking: Partial<CalendarEvent>): Promise<CalendarEvent> => {
  try {
    // First verify ownership
    const existingResponse = await fetch(`${API_URL}/${id}`);
    if (!existingResponse.ok) throw new Error('Failed to fetch booking');
    const existingBookingData = await existingResponse.json();

    const userId = localStorage.getItem('userId');
    if (existingBookingData.userId !== userId) {  // Fixed: was existingBookingData.userID
      throw new Error('Unauthorized: You can only edit your own bookings');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: booking.title,
        bookingDate: booking.date ? formatDate(booking.date) : undefined,
        startTime: booking.startTime,
        endTime: booking.endTime,
        description: booking.description,
        recurrenceRule: booking.recurrenceRule
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update booking');
    }

    const data = await response.json();
    
    // Map backend response to frontend format
    return {
      id: data.bookingId,              // Fixed: was data.bookingID
      title: data.title,
      date: data.bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      roomId: data.roomId,             // Fixed: was data.roomID
      description: data.description,
      recurrenceRule: data.recurrenceRule,
      userId: data.userId              // Fixed: was data.userID
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    // First verify ownership
    const existingResponse = await fetch(`${API_URL}/${id}`);
    if (!existingResponse.ok) throw new Error('Failed to fetch booking');
    const existingBooking = await existingResponse.json();

    const userId = localStorage.getItem('userId');
    if (existingBooking.userId !== userId) {  // Fixed: was existingBooking.userID
      throw new Error('Unauthorized: You can only delete your own bookings');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete booking');
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const checkBookingConflict = async (
  room: Room,
  date: string,
  startTime: string,
  endTime: string,
  recurrenceRule?: string,
  excludeId?: string
): Promise<{ hasConflict: boolean; conflictingEvents: CalendarEvent[] }> => {
  try {
    // First check if the booking is within room availability
    const convertToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);
    const roomStartMinutes = convertToMinutes(room.timeStart);
    const roomEndMinutes = convertToMinutes(room.timeEnd);

    if (startMinutes < roomStartMinutes || endMinutes > roomEndMinutes) {
      return { 
        hasConflict: true, 
        conflictingEvents: [] // Empty array indicates room availability conflict
      };
    }

    const allBookings = await getBookings();
    const conflictingEvents: CalendarEvent[] = [];

    const getRecurringDates = (startDate: Date, rule: ReturnType<typeof parseRecurrenceRule>) => {
      const dates: Date[] = [];
      let currentDate = new Date(startDate);
      const endDate = rule.until || new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + 1); // Default to 1 month if no until date

      while (currentDate <= endDate && dates.length < 100) { // Safety limit
        if (rule.freq === 'DAILY') {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (rule.freq === 'WEEKLY') {
          if (rule.days.length === 0 || rule.days.includes(['SU','MO','TU','WE','TH','FR','SA'][currentDate.getDay()])) {
            dates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (rule.freq === 'MONTHLY') {
          dates.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }

      return dates;
    };

    for (const booking of allBookings) {
      if (booking.roomId !== room.id || booking.id === excludeId) continue;
      
      const bookingDate = new Date(booking.date);
      const newDate = new Date(date);

      // Check for single event conflicts
      if (!booking.recurrenceRule && !recurrenceRule) {
        if (booking.date === date && timeRangesOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
          conflictingEvents.push(booking);
        }
        continue;
      }

      // Check recurring vs single
      if (booking.recurrenceRule && !recurrenceRule) {
        const rule = parseRecurrenceRule(booking.recurrenceRule);
        const dates = getRecurringDates(bookingDate, rule);
        
        if (dates.some(d => d.toDateString() === newDate.toDateString()) && 
            timeRangesOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
          conflictingEvents.push(booking);
        }
        continue;
      }

      // Check single vs recurring
      if (!booking.recurrenceRule && recurrenceRule) {
        const rule = parseRecurrenceRule(recurrenceRule);
        const dates = getRecurringDates(newDate, rule);
        
        if (dates.some(d => d.toDateString() === bookingDate.toDateString()) && 
            timeRangesOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
          conflictingEvents.push(booking);
        }
        continue;
      }

      // Check recurring vs recurring
      if (booking.recurrenceRule && recurrenceRule) {
        const bookingRule = parseRecurrenceRule(booking.recurrenceRule);
        const newRule = parseRecurrenceRule(recurrenceRule);
        
        const bookingDates = getRecurringDates(bookingDate, bookingRule);
        const newDates = getRecurringDates(newDate, newRule);
        
        const hasDateOverlap = bookingDates.some(bd => 
          newDates.some(nd => 
            bd.toDateString() === nd.toDateString() && 
            timeRangesOverlap(startTime, endTime, booking.startTime, booking.endTime)
          )
        );
        
        if (hasDateOverlap) {
          conflictingEvents.push(booking);
        }
      }
    }

    return {
      hasConflict: conflictingEvents.length > 0,
      conflictingEvents
    };
  } catch (error) {
    console.error('Error checking booking conflicts:', error);
    throw error;
  }
};

export const createRecurringBookings = async (
  baseBooking: Omit<CalendarEvent, 'id'>,
  recurrenceRule: string
): Promise<CalendarEvent[]> => {
  try {
    const createdBookings: CalendarEvent[] = [];
    const startDate = new Date(baseBooking.date);
    const rule = parseRecurrenceRule(recurrenceRule);

    const getRecurringDates = () => {
      const dates: Date[] = [];
      let currentDate = new Date(startDate);
      const endDate = rule.until || new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + 1); // Default to 1 month if no until date

      while (currentDate <= endDate && dates.length < 100) {
        if (rule.freq === 'DAILY') {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (rule.freq === 'WEEKLY') {
          if (rule.days.length === 0 || rule.days.includes(['SU','MO','TU','WE','TH','FR','SA'][currentDate.getDay()])) {
            dates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (rule.freq === 'MONTHLY') {
          dates.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }

      return dates;
    };

    const dates = getRecurringDates();

    for (const date of dates) {
      try {
        const bookingDate = formatDate(date);
        const newBooking = await createBooking({
          ...baseBooking,
          date: bookingDate,
          recurrenceRule: date.getTime() === startDate.getTime() ? recurrenceRule : undefined
        });
        createdBookings.push(newBooking);
      } catch (error) {
        console.error(`Error creating booking for ${date.toISOString().split('T')[0]}:`, error);
      }
    }

    return createdBookings;
  } catch (error) {
    console.error('Error creating recurring bookings:', error);
    throw error;
  }
};