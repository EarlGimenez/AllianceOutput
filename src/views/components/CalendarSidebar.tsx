import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  Paper,
  InputBase,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookingForm from './BookingForm';
import { Room } from '../services/roomService';

interface CalendarSidebarProps {
  open: boolean;
  onToggle: () => void;
  rooms: Room[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  purposeFilter: string;
  onPurposeFilterChange: (purpose: string) => void;
  timeFilterStart: string;
  onTimeFilterStartChange: (time: string) => void;
  timeFilterEnd: string;
  onTimeFilterEndChange: (time: string) => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  open,
  onToggle,
  rooms,
  searchQuery,
  onSearchChange,
  purposeFilter,
  onPurposeFilterChange,
  timeFilterStart,
  onTimeFilterStartChange,
  timeFilterEnd,
  onTimeFilterEndChange,
}) => {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Update filtered rooms when filters or rooms change
  useEffect(() => {
    const filtered = rooms.filter(room => {
      // Search filter
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Purpose filter
      const matchesPurpose = !purposeFilter || room.purpose === purposeFilter;
      
      // Time filter (convert to minutes for comparison)
      const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const roomStart = toMinutes(room.timeStart);
      const roomEnd = toMinutes(room.timeEnd);
      const filterStart = toMinutes(timeFilterStart || '00:00');
      const filterEnd = toMinutes(timeFilterEnd || '23:59');
      
      const matchesTime = (!timeFilterStart || roomEnd > filterStart) && 
                         (!timeFilterEnd || roomStart < filterEnd);
      
      return matchesSearch && matchesPurpose && matchesTime;
    });
    
    setFilteredRooms(filtered);
  }, [rooms, searchQuery, purposeFilter, timeFilterStart, timeFilterEnd]);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setSelectedRoom(null);
  };

  // Extract unique purposes from rooms
  const uniquePurposes = Array.from(new Set(rooms.map(room => room.purpose)));

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        '& .MuiDrawer-paper': {
          width: 350,
          boxSizing: 'border-box',
          bgcolor: '#f5f5f5',
          marginTop: '80px',
          height: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Rooms
        </Typography>
        
        {/* Search Input */}
        <InputBase
          fullWidth
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          startAdornment={
            <IconButton>
              <SearchIcon />
            </IconButton>
          }
          sx={{
            pl: 1,
            mb: 2,
            border: '1px solid #ddd',
            borderRadius: 1,
          }}
        />

        {/* Purpose Filter */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Filter by Purpose</InputLabel>
          <Select
            value={purposeFilter}
            label="Filter by Purpose"
            onChange={(e) => onPurposeFilterChange(e.target.value as string)}
          >
            <MenuItem value="">All Purposes</MenuItem>
            {uniquePurposes.map((purpose) => (
              <MenuItem key={purpose} value={purpose}>
                {purpose}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Time Filter */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="time"
            label="Start Time"
            value={timeFilterStart}
            onChange={(e) => onTimeFilterStartChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="time"
            label="End Time"
            value={timeFilterEnd}
            onChange={(e) => onTimeFilterEndChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      {/* Filtered Rooms List */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {filteredRooms.length > 0 ? (
          <Grid container spacing={2}>
            {filteredRooms.map((room) => (
              <Grid item xs={12} key={room.id}>
                <Card
                  sx={{
                    display: 'flex',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 },
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120 }}
                    image={room.image}
                    alt={room.name}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {room.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {room.location}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Available: {room.timeStart} - {room.timeEnd}
                    </Typography>
                    {room.purpose && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Purpose: {room.purpose}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ py: 2, textAlign: 'center' }}>
            No rooms found matching your search
          </Typography>
        )}
      </Box>

      {/* Booking Dialog */}
      <Dialog open={isBookingFormOpen} onClose={handleCloseBookingForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>Create Booking</DialogTitle>
        <DialogContent>
          <BookingForm
            rooms={rooms}
            onSubmit={() => {}}
            onCancel={handleCloseBookingForm}
            initialData={{ roomId: selectedRoom?.id }}
          />
        </DialogContent>
      </Dialog>
    </Drawer>
  );
};

export default CalendarSidebar;
