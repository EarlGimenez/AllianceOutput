import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  useTheme, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  DialogActions
} from '@mui/material';
import { CalendarEvent } from '../../components/CalendarEvents';
import { LandingNav } from '../../components/LandingNav';
import BookingForm from '../../components/BookingForm';
import { createBooking, updateBooking, deleteBooking } from '../../services/bookingService';
import { getRooms, Room } from '../../services/roomService';
import CalendarHeader from '../../components/CalendarHeader';
import CalendarSidebar from '../../components/CalendarSidebar';
import DayView from '../../components/DayView';
import MonthView from '../../components/MonthView';
import EventPopover from '../../components/EventPopover';

const generateBookingColor = (id: string, alpha = 0.7) => {
  const hash = id.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = Math.abs(hash % 360);
  const adjustedHue = (hue % 60) + 200;
  
  return `hsla(${adjustedHue}, 80%, 60%, ${alpha})`;
};

interface CalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onAddEvent?: (newEvent: Partial<CalendarEvent>) => Promise<void>;
  onEditEvent?: (updatedEvent: CalendarEvent) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({
  events: initialEvents,
  onAddEvent: parentOnAddEvent,
  onEditEvent: parentOnEditEvent,
  onDeleteEvent: parentOnDeleteEvent,
  currentDate: passedCurrentDate,
  onDateChange,
}) => {
  const theme = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [internalCurrentDate, setInternalCurrentDate] = useState(passedCurrentDate || new Date());
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<'day' | 'month'>('day');
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [formDate, setFormDate] = useState<Date | undefined>(passedCurrentDate || new Date());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const roomsPerPage = 5;

  const currentDate = onDateChange ? passedCurrentDate : internalCurrentDate;
  const setCurrentDate = (newDate: Date) => {
    if (onDateChange) {
      onDateChange(newDate);
    } else {
      setInternalCurrentDate(newDate);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRooms();
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      } catch (error) {
        console.error('Error loading rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRooms(filtered);
    }
    setCurrentPage(0); // Reset to first page when search changes
  }, [searchQuery, rooms]);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    if (!onDateChange) {
      setInternalCurrentDate(passedCurrentDate || new Date());
    }
  }, [passedCurrentDate, onDateChange]);

  useEffect(() => {
    if (!editingEvent) {
      setFormDate(currentDate);
    }
  }, [currentDate, editingEvent]);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    dayEvents: CalendarEvent[],
    date: Date
  ) => {
    setPopoverAnchorEl(event.currentTarget);
    setPopoverEvents(dayEvents);
    setPopoverDate(date);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'day' | 'month' | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleDateNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  const handleOpenBookingForm = (eventToEdit?: CalendarEvent, dateForNew?: Date) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setFormDate(eventToEdit.date ? new Date(eventToEdit.date + 'T00:00:00') : undefined);
    } else {
      setEditingEvent(undefined);
      setFormDate(dateForNew || currentDate);
    }
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setEditingEvent(undefined);
  };

const handleBookingSubmit = async (bookingData: Partial<CalendarEvent>) => {
  try {
    const adjustToLocalDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
    };

    const bookingDate = bookingData.date 
      ? adjustToLocalDate(bookingData.date)
      : adjustToLocalDate(currentDate.toISOString());

    let updatedEvents = [...events];
    
    if (bookingData.id) {
      // Update existing booking
      const updatedBooking = await updateBooking(bookingData.id, {
        ...bookingData,
        date: bookingDate
      });
      
      if (parentOnEditEvent) {
        await parentOnEditEvent(updatedBooking);
      } else {
        updatedEvents = updatedEvents.map(ev => 
          ev.id === updatedBooking.id ? updatedBooking : ev
        );
      }
    } else {
      // Create new booking
      const newBooking = await createBooking({
        ...bookingData,
        date: bookingDate,
        userId: localStorage.getItem('userId') || ''
      } as Omit<CalendarEvent, 'id'>);
      
      if (parentOnAddEvent) {
        await parentOnAddEvent(newBooking);
      } else {
        updatedEvents = [...updatedEvents, newBooking];
      }
    }

    // Force update by creating a new array reference
    setEvents(updatedEvents);
    handleCloseBookingForm();
  } catch (error) {
    console.error('Error saving booking:', error);
    alert('Failed to save booking');
  }
};

  const handleCreateButtonClick = () => {
    handleOpenBookingForm(undefined, currentDate);
  };

  const handleEventInteraction = (event: CalendarEvent) => {
    handleOpenBookingForm(event);
  };

  const handleDayClickInMonthView = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const handleRequestDelete = (eventId: string) => {
    setEventToDeleteId(eventId);
    setDeleteConfirmOpen(true);
    if (editingEvent?.id === eventId) {
        handleCloseBookingForm();
    }
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setEventToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDeleteId) return;
    
    try {
      await deleteBooking(eventToDeleteId);
      if (parentOnDeleteEvent) {
        await parentOnDeleteEvent(eventToDeleteId);
      } else {
        setEvents(prev => prev.filter(event => event.id !== eventToDeleteId));
      }
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  const handleRoomPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const visibleRooms = filteredRooms.slice(
    currentPage * roomsPerPage,
    (currentPage + 1) * roomsPerPage
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <LandingNav />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <CalendarSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          rooms={filteredRooms}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#D2E4FF",
            p: { xs: 1, sm: 2, md: 3 },
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: sidebarOpen ? '350px' : '0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 3 },
              overflow: 'hidden',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CalendarHeader
              view={view}
              currentDate={currentDate}
              onViewChange={handleViewChange}
              onDateNavigate={handleDateNavigate}
              onCreateClick={handleCreateButtonClick}
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {view === 'day' ? (
                <DayView
                  currentDate={currentDate}
                  events={events}
                  rooms={visibleRooms}
                  onEventClick={handleEventInteraction}
                  generateBookingColor={generateBookingColor}
                  currentPage={currentPage}
                  roomsPerPage={roomsPerPage}
                  totalRooms={filteredRooms.length}
                  onPageChange={handleRoomPageChange}
                />
              ) : (
                <MonthView
                  currentDate={currentDate}
                  events={events}
                  rooms={rooms}
                  onDayClick={handleDayClickInMonthView}
                  onEventHover={handlePopoverOpen}
                  generateBookingColor={generateBookingColor}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      <EventPopover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        events={popoverEvents}
        date={popoverDate}
        rooms={rooms}
        onEventClick={handleEventInteraction}
      />

      <Dialog open={isBookingFormOpen} onClose={handleCloseBookingForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>{editingEvent?.id ? 'Edit Booking' : 'Create Booking'}</DialogTitle>
        <DialogContent>
          <BookingForm
            rooms={rooms}
            onSubmit={handleBookingSubmit}
            onCancel={handleCloseBookingForm}
            initialData={editingEvent}
            currentDate={formDate}
            onDelete={handleRequestDelete}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to cancel this reservation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;