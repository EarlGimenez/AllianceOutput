import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material';
import { CalendarEvent, Room } from './CalendarEvents';
import { createBooking, createRecurringBookings } from '../services/bookingService';

interface BookingFormProps {
  rooms: Room[];
  onSubmit: (bookingData: Partial<CalendarEvent>) => void;
  onCancel: () => void;
  initialData?: Partial<CalendarEvent>;
  currentDate?: Date;
  onDelete?: (eventId: string) => void; // Added for delete functionality
}

// Update the formatDateForInput function
const formatDateForInput = (date: Date | undefined | string): string => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    // Force UTC to avoid timezone issues
    const year = d.getUTCFullYear();
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = d.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
};

// Update the formatTimeForInput function
const formatTimeForInput = (time: string | undefined): string => {
  if (!time) return '09:00';
  // Simple validation for HH:MM format
  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    return time;
  }
  return '09:00'; // Default fallback
};

const BookingForm: React.FC<BookingFormProps> = ({
  rooms,
  onSubmit,
  onCancel,
  initialData,
  currentDate,
  onDelete, // Added onDelete prop
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(formatDateForInput(initialData?.date || currentDate));
  const [startTime, setStartTime] = useState(formatTimeForInput(initialData?.startTime) || '09:00');
  const [endTime, setEndTime] = useState(formatTimeForInput(initialData?.endTime) || '10:00');
  const [selectedRoom, setSelectedRoom] = useState<string>(initialData?.room || (rooms.length > 0 ? rooms[0] : ''));
  const [description, setDescription] = useState(initialData?.description || '');

  const [isRecurring, setIsRecurring] = useState(!!initialData?.recurrenceRule);
  const [recurrenceType, setRecurrenceType] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setTitle(initialData?.title || '');
    setStartTime(formatTimeForInput(initialData?.startTime) || '09:00');
    setEndTime(formatTimeForInput(initialData?.endTime) || '10:00');
    setSelectedRoom(initialData?.room || (rooms.length > 0 ? rooms[0] : ''));
    setDescription(initialData?.description || '');
    setErrors({});

    if (initialData?.recurrenceRule) {
      setIsRecurring(true);
      const rule = initialData.recurrenceRule;
      if (rule.includes('FREQ=DAILY')) setRecurrenceType('daily');
      else if (rule.includes('FREQ=WEEKLY')) {
        setRecurrenceType('weekly');
        const byDayMatch = rule.match(/BYDAY=([A-Z,]+)/);
        if (byDayMatch && byDayMatch[1]) {
          setWeeklyDays(byDayMatch[1].split(','));
        } else {
          setWeeklyDays([]);
        }
      } else if (rule.includes('FREQ=MONTHLY')) setRecurrenceType('monthly');
      else setRecurrenceType('none');

      const untilMatch = rule.match(/UNTIL=([0-9T]+Z)/);
      if (untilMatch && untilMatch[1]) {
        const untilDateString = untilMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');
        const untilDate = new Date(untilDateString);
        setRecurrenceEndDate(formatDateForInput(untilDate));
      } else {
        setRecurrenceEndDate('');
      }
    } else {
      setIsRecurring(false);
      setRecurrenceType('none');
      setRecurrenceEndDate('');
      setWeeklyDays([]);
    }
  }, [initialData, rooms]);

  useEffect(() => {
    setDate(formatDateForInput(initialData?.date || currentDate));
  }, [initialData?.date, currentDate]);

  // Update the validate function
const validate = (): boolean => {
  const newErrors: { [key: string]: string } = {};
  
  // Basic validation
  if (!title.trim()) newErrors.title = 'Title is required';
  if (!startTime) newErrors.startTime = 'Start time required';
  if (!endTime) newErrors.endTime = 'End time required';
  if (startTime >= endTime) newErrors.endTime = 'Must be after start';
  if (!selectedRoom) newErrors.room = 'Room required';

  // Date validation
  if (!date) {
    newErrors.date = isRecurring ? 'Start date required' : 'Date required';
  } else {
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      newErrors.date = 'Invalid date';
    }
  }

  // Recurrence validation
  if (isRecurring) {
    if (recurrenceType === 'none') {
      newErrors.recurrenceType = 'Select recurrence type';
    }
    if (recurrenceType === 'weekly' && weeklyDays.length === 0) {
      newErrors.weeklyDays = 'Select at least one day';
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!validate()) return;

  const userId = localStorage.getItem('userId') || '';
  const bookingDate = date || formatDateForInput(currentDate) || '';
  
  const bookingData: Partial<CalendarEvent> = {
    id: initialData?.id,
    title,
    date: bookingDate,
    startTime,
    endTime,
    room: selectedRoom as Room,
    description
  };

  if (isRecurring && recurrenceType !== 'none') {
    let rrule = `RRULE:FREQ=${recurrenceType.toUpperCase()}`;
    if (recurrenceType === 'weekly' && weeklyDays.length > 0) {
      rrule += `;BYDAY=${weeklyDays.join(',')}`;
    }
    // Add 1 month limit
    const endDate = new Date(bookingDate);
    endDate.setMonth(endDate.getMonth() + 1);
    rrule += `;UNTIL=${endDate.toISOString().replace(/[-:.]/g, '').slice(0, 15)}Z`;
    
    bookingData.recurrenceRule = rrule;
  }

  onSubmit(bookingData);
};

  const handleIsRecurringChange = (checked: boolean) => {
    setIsRecurring(checked);
    if (errors.recurrenceType) setErrors(prev => ({...prev, recurrenceType: ''}));
    if (!checked) {
      setRecurrenceType('none');
      setWeeklyDays([]);
      setRecurrenceEndDate('');
    } else {
      if (recurrenceType === 'none') {
        setRecurrenceType('daily');
      }
    }
  };

// Update the recurrence type change handler
const handleRecurrenceTypeChange = (newType: 'none' | 'daily' | 'weekly' | 'monthly') => {
  setRecurrenceType(newType);
  if (errors.recurrenceType) setErrors(prev => ({...prev, recurrenceType: ''}));
  
  if (newType === 'none') {
    setIsRecurring(false);
    setWeeklyDays([]);
  } else {
    setIsRecurring(true);
    // Set default weekly days if switching to weekly
    if (newType === 'weekly' && weeklyDays.length === 0) {
      const defaultDay = ['MO','TU','WE','TH','FR'][new Date(date || currentDate || new Date()).getDay() - 1] || 'MO';
      setWeeklyDays([defaultDay]);
    }
  }
};


  const handleWeeklyDayChange = (day: string) => {
    setWeeklyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
    if (errors.weeklyDays) setErrors(prev => ({...prev, weeklyDays: ''}));
  };

const dayOptions = [
  { value: 'MO', label: 'Monday' },
  { value: 'TU', label: 'Tuesday' },
  { value: 'WE', label: 'Wednesday' },
  { value: 'TH', label: 'Thursday' },
  { value: 'FR', label: 'Friday' },
  { value: 'SA', label: 'Saturday' },
  { value: 'SU', label: 'Sunday' }
];

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: { xs: 1, sm: 2 } }}>
      {/* <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {initialData?.id ? 'Edit Booking' : 'Create Booking'}
      </Typography> */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="title"
            label="Booking Title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({...prev, title: ''})); }}
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>
        <Grid item xs={12} sm={(isRecurring && recurrenceType !== 'none') ? 6 : 12}>
          <TextField
            required={!isRecurring || (isRecurring && recurrenceType !== 'none')}
            fullWidth
            id={isRecurring ? "startDate" : "date"}
            label={isRecurring ? "Start Date" : "Date"}
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); if (errors.date) setErrors(prev => ({...prev, date: ''})); }}
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date}
            disabled={isRecurring && recurrenceType === 'none'}
          />
        </Grid>
        {isRecurring && recurrenceType !== 'none' && (
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    id="recurrenceEndDate"
                    label="Recurrence End Date"
                    type="date"
                    value={recurrenceEndDate}
                    onChange={(e) => { setRecurrenceEndDate(e.target.value); if (errors.recurrenceEndDate) setErrors(prev => ({...prev, recurrenceEndDate: ''}));}}
                    InputLabelProps={{ shrink: true }}
                    helperText={errors.recurrenceEndDate || "Optional. Leave blank for indefinite recurrence."}
                    error={!!errors.recurrenceEndDate}
                />
            </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="startTime"
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => { setStartTime(e.target.value); if (errors.startTime) setErrors(prev => ({...prev, startTime: ''})); }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }} // 5 minute steps
            error={!!errors.startTime}
            helperText={errors.startTime}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="endTime"
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => { setEndTime(e.target.value); if (errors.endTime) setErrors(prev => ({...prev, endTime: ''})); }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }} // 5 minute steps
            error={!!errors.endTime}
            helperText={errors.endTime}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.room}>
            <InputLabel id="room-select-label">Room</InputLabel>
            <Select
              labelId="room-select-label"
              id="selectedRoom"
              value={selectedRoom}
              label="Room"
              onChange={(e) => { setSelectedRoom(e.target.value as string); if (errors.room) setErrors(prev => ({...prev, room: ''}));}}
            >
              {rooms.map((roomName) => (
                <MenuItem key={roomName} value={roomName}>
                  {roomName}
                </MenuItem>
              ))}
            </Select>
            {errors.room && <FormHelperText>{errors.room}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Optional"
          />
        </Grid>

        <Grid item xs={12}>
            <FormControlLabel
                control={<Checkbox checked={isRecurring} onChange={(e) => handleIsRecurringChange(e.target.checked)} />}
                label="Set as Recurring Booking"
            />
        </Grid>

        {isRecurring && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.recurrenceType}>
                <InputLabel id="recurrence-type-label">Repeats</InputLabel>
                <Select
                  labelId="recurrence-type-label"
                  value={recurrenceType}
                  label="Repeats"
                  onChange={(e) => handleRecurrenceTypeChange(e.target.value as typeof recurrenceType)}
                >
                  <MenuItem value="none">Does not repeat</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
                {errors.recurrenceType && <FormHelperText>{errors.recurrenceType}</FormHelperText>}
              </FormControl>
            </Grid>

            {recurrenceType === 'weekly' && (
              <Grid item xs={12}>
                <FormControl component="fieldset" error={!!errors.weeklyDays}>
                  <Typography variant="subtitle2" component="legend" sx={{mb:1, color: errors.weeklyDays ? 'error.main' : 'text.secondary'}}>
                    Repeat on:
                  </Typography>
                  <FormGroup row>
                    {dayOptions.map(day => (
                      <FormControlLabel
                        key={day.value}
                        control={
                          <Checkbox
                            checked={weeklyDays.includes(day.value)}
                            onChange={() => handleWeeklyDayChange(day.value)}
                          />
                        }
                        label={day.label}
                      />
                    ))}
                  </FormGroup>
                  {errors.weeklyDays && <FormHelperText>{errors.weeklyDays}</FormHelperText>}
                </FormControl>
              </Grid>
            )}
          </>
        )}

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 2 }}>
          <Box>
            {initialData?.id && onDelete && (
              <Button 
                onClick={() => onDelete(initialData!.id!)} 
                variant="outlined" 
                color="error"
              >
                Delete
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onCancel} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {initialData?.id ? 'Save Changes' : 'Create Booking'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;