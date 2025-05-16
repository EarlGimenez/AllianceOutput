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
import { checkBookingConflict } from '../services/bookingService';

interface BookingFormProps {
  rooms: Room[];
  onSubmit: (bookingData: Partial<CalendarEvent>) => void;
  onCancel: () => void;
  initialData?: Partial<CalendarEvent>;
  currentDate?: Date;
  onDelete?: (eventId: string) => void;
}

const formatDateForInput = (date: Date | string): string => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
};

const formatTimeForInput = (time: string | undefined): string => {
  if (!time) return '09:00';
  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    return time;
  }
  return '09:00';
};

const validateTimeAgainstRoom = (room: Room, startTime: string, endTime: string): { valid: boolean; message?: string } => {
  const convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = convertToMinutes(startTime);
  const endMinutes = convertToMinutes(endTime);
  const roomStartMinutes = convertToMinutes(room.timeStart);
  const roomEndMinutes = convertToMinutes(room.timeEnd);

  if (startMinutes < roomStartMinutes) {
    return { 
      valid: false, 
      message: `Booking cannot start before ${room.timeStart} (room opening time)` 
    };
  }

  if (endMinutes > roomEndMinutes) {
    return { 
      valid: false, 
      message: `Booking cannot end after ${room.timeEnd} (room closing time)` 
    };
  }

  return { valid: true };
};

const BookingForm: React.FC<BookingFormProps> = ({
  rooms,
  onSubmit,
  onCancel,
  initialData,
  currentDate,
  onDelete,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(() => {
    if (initialData?.date) return formatDateForInput(initialData.date);
    return currentDate ? formatDateForInput(currentDate) : formatDateForInput(new Date());
  });
  const [startTime, setStartTime] = useState(() => {
    const initialTime = initialData?.startTime;
    return initialTime ? formatTimeForInput(initialTime) : '09:00';
  });
  const [endTime, setEndTime] = useState(() => {
    const initialTime = initialData?.endTime;
    return initialTime ? formatTimeForInput(initialTime) : '10:00';
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    initialData?.roomId || (rooms.length > 0 ? rooms[0].id : '')
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [isRecurring, setIsRecurring] = useState(!!initialData?.recurrenceRule);
  const [recurrenceType, setRecurrenceType] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isAdmin = localStorage.getItem("adminAuthenticated") === "true";
  const currentUserId = localStorage.getItem('userId') || '';
  const isEditing = !!initialData?.id;
  const isOwner = initialData?.userId === currentUserId;
  const canEditDelete = isAdmin || (isEditing && isOwner);
  const isCreating = !initialData?.id;

  useEffect(() => {
    if (!initialData?.endTime && !initialData?.startTime) {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const endHours = end.getHours().toString().padStart(2, '0');
      const endMinutes = end.getMinutes().toString().padStart(2, '0');
      setEndTime(`${endHours}:${endMinutes}`);
    }
  }, [startTime, initialData]);

  useEffect(() => {
    setTitle(initialData?.title || '');
    setStartTime(formatTimeForInput(initialData?.startTime) || '09:00');
    setEndTime(formatTimeForInput(initialData?.endTime) || '10:00');
    setSelectedRoomId(initialData?.roomId || (rooms.length > 0 ? rooms[0].id : ''));
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

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!startTime) newErrors.startTime = 'Start time required';
    if (!endTime) newErrors.endTime = 'End time required';
    if (startTime >= endTime) newErrors.endTime = 'End time must be after start time';
    if (!selectedRoomId) newErrors.room = 'Room required';

    if (!date) {
      newErrors.date = isRecurring ? 'Start date required' : 'Date required';
    } else {
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) {
        newErrors.date = 'Invalid date';
      }
    }

    const selectedRoom = rooms.find(r => r.id === selectedRoomId);
    if (selectedRoom && startTime && endTime) {
      const timeValidation = validateTimeAgainstRoom(selectedRoom, startTime, endTime);
      if (!timeValidation.valid && timeValidation.message) {
        newErrors.endTime = timeValidation.message;
      }
    }

    if (isRecurring && recurrenceType !== 'none' && recurrenceEndDate) {
      const endDate = new Date(recurrenceEndDate);
      const startDate = new Date(date || currentDate || new Date());
      
      if (endDate < startDate) {
        newErrors.recurrenceEndDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const userId = isCreating ? currentUserId : (isAdmin ? initialData?.userId || currentUserId : currentUserId);
    const bookingDate = date || formatDateForInput(currentDate) || '';
    
    try {
      const recurrenceRule = isRecurring && recurrenceType !== 'none' ? generateRecurrenceRule() : undefined;
      
      const selectedRoom = rooms.find(r => r.id === selectedRoomId);
      if (!selectedRoom) {
        setErrors(prev => ({...prev, room: 'Please select a valid room'}));
        return;
      }

      const { hasConflict, conflictingEvents } = await checkBookingConflict(
        selectedRoom,
        bookingDate,
        startTime,
        endTime,
        recurrenceRule,
        initialData?.id
      );

      if (hasConflict) {
        if (conflictingEvents.length === 0) {
          const timeValidation = validateTimeAgainstRoom(selectedRoom, startTime, endTime);
          if (!timeValidation.valid && timeValidation.message) {
            setErrors(prev => ({...prev, endTime: timeValidation.message}));
          }
        } else {
          const conflictMessage = `Conflict with existing booking(s):\n${
            conflictingEvents.map(e => 
              `${e.title} (${e.date} ${e.startTime}-${e.endTime}${e.recurrenceRule ? ' (Recurring)' : ''})`
            ).join('\n')
          }`;
          alert(conflictMessage);
        }
        return;
      }

      const bookingData: Partial<CalendarEvent> = {
        id: initialData?.id,
        title,
        date: bookingDate,
        startTime,
        endTime,
        roomId: selectedRoomId,
        description,
        userId,
        recurrenceRule
      };

      onSubmit(bookingData);
    } catch (error) {
      console.error('Error checking booking conflicts:', error);
      alert('Error checking for booking conflicts. Please try again.');
    }
  };

  const generateRecurrenceRule = (): string => {
    let rrule = `RRULE:FREQ=${recurrenceType.toUpperCase()}`;
    
    if (recurrenceType === 'weekly' && weeklyDays.length > 0) {
      rrule += `;BYDAY=${weeklyDays.join(',')}`;
    }

    if (recurrenceEndDate) {
      const endDate = new Date(recurrenceEndDate);
      endDate.setHours(23, 59, 59);
      rrule += `;UNTIL=${endDate.toISOString().replace(/[-:.]/g, '').slice(0, 15)}Z`;
    } else {
      const defaultEndDate = new Date(date || currentDate || new Date());
      defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);
      rrule += `;UNTIL=${defaultEndDate.toISOString().replace(/[-:.]/g, '').slice(0, 15)}Z`;
    }
    
    return rrule;
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

  const handleRecurrenceTypeChange = (newType: 'none' | 'daily' | 'weekly' | 'monthly') => {
    setRecurrenceType(newType);
    if (errors.recurrenceType) setErrors(prev => ({...prev, recurrenceType: ''}));
    
    if (newType === 'none') {
      setIsRecurring(false);
      setWeeklyDays([]);
    } else {
      setIsRecurring(true);
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
            disabled={isEditing && !canEditDelete}
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
            disabled={(isRecurring && recurrenceType === 'none') || (isEditing && !canEditDelete)}
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
              onChange={(e) => { 
                setRecurrenceEndDate(e.target.value); 
                if (errors.recurrenceEndDate) setErrors(prev => ({...prev, recurrenceEndDate: ''}));
              }}
              InputLabelProps={{ shrink: true }}
              helperText={errors.recurrenceEndDate || "Optional. Leave blank for default 1 month duration."}
              error={!!errors.recurrenceEndDate}
              inputProps={{
                min: date
              }}
              disabled={isEditing && !canEditDelete}
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
            inputProps={{ step: 300 }}
            error={!!errors.startTime}
            helperText={errors.startTime}
            disabled={isEditing && !canEditDelete}
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
            inputProps={{ step: 300 }}
            error={!!errors.endTime}
            helperText={errors.endTime}
            disabled={isEditing && !canEditDelete}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.room}>
            <InputLabel id="room-select-label">Room</InputLabel>
            <Select
              labelId="room-select-label"
              id="selectedRoom"
              value={selectedRoomId}
              label="Room"
              onChange={(e) => {
                setSelectedRoomId(e.target.value as string);
                if (errors.room) setErrors(prev => ({...prev, room: ''}));
              }}
              disabled={isEditing && !canEditDelete}
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
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
            disabled={isEditing && !canEditDelete}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={isRecurring} 
                onChange={(e) => handleIsRecurringChange(e.target.checked)} 
                disabled={isEditing && !canEditDelete}
              />
            }
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
                  disabled={isEditing && !canEditDelete}
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
                            disabled={isEditing && !canEditDelete}
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
            {isEditing && onDelete && canEditDelete && (
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
            { isOwner ? (
              <Button type="submit" variant="contained" color="primary">
              { isEditing ? 'Save Changes' : 'Create Booking' }
            </Button>
            ) : '' }
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;