// CalendarSidebar.tsx
import React, { useState } from 'react';
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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setSelectedRoom(null);
  };

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
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* Purpose filter */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="purpose-filter-label">Filter by Purpose</InputLabel>
          <Select
            value={purposeFilter}
            labelId="purpose-filter-label"
            label="Filter by Purpose"
            size="small"
            onChange={(e) => onPurposeFilterChange(e.target.value as string)}
          >
            <MenuItem value="">All Purposes</MenuItem>
            <MenuItem value="Meetings">Meetings</MenuItem>
            <MenuItem value="Lectures">Lectures</MenuItem>
            <MenuItem value="Presentations">Presentations</MenuItem>
          </Select>
        </FormControl>

        {/* Time filter */}
        <Box sx={{ mt: 2, display: 'flex' }}>
          <TextField
            type="time"
            label="Start Time"
            value={timeFilterStart}
            onChange={(e) => onTimeFilterStartChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ mr: 1 }}
          />
          <TextField
            type="time"
            label="End Time"
            value={timeFilterEnd}
            onChange={(e) => onTimeFilterEndChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Box>
      </Box>

      {/* Rest of the component remains the same */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          pr: 3,
        }}
      >
        {rooms.length > 0 ? (
          <Grid container spacing={2}>
            {rooms.map((room) => (
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
