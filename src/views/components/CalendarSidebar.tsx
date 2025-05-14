import React from 'react';
import { Box, Drawer, Typography, Paper, InputBase, IconButton, Grid, Card, CardMedia, CardContent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Room } from './CalendarEvents';

interface CalendarSidebarProps {
  open: boolean;
  onToggle: () => void;
  rooms: Room[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  open,
  onToggle,
  rooms,
  searchQuery,
  onSearchChange,
}) => {
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
      </Box>
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
                    '&:hover': {
                      boxShadow: 3,
                    },
                  }}
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
    </Drawer>
  );
};

export default CalendarSidebar;