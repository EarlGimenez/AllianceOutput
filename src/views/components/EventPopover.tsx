import React from 'react';
import { Box, Typography, Popover, List, ListItem, ListItemText, Link } from '@mui/material';
import { CalendarEvent } from './CalendarEvents';

interface EventPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  events: CalendarEvent[];
  date: Date | null;
  rooms: { id: string; name: string }[];
  onEventClick: (event: CalendarEvent) => void;
}

const EventPopover: React.FC<EventPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  events,
  date,
  rooms,
  onEventClick,
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        onMouseEnter: () => { /* Keep popover open */ },
        onMouseLeave: onClose,
        sx: { pointerEvents: 'auto' }
      }}
      disableRestoreFocus
    >
      <Box sx={{ p: 2, minWidth: 250, maxWidth: 350 }}>
        {date && (
          <Typography variant="h6" gutterBottom>
            Events for {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </Typography>
        )}
        <List dense>
          {events.map(event => {
            const room = rooms.find(r => r.id === event.roomId);
            return (
              <ListItem key={event.id} disablePadding>
                <Link
                  component="button"
                  onClick={() => {
                    onEventClick(event);
                    onClose();
                  }}
                  sx={{ width: '100%', textAlign: 'left', textDecoration: 'none', color: 'inherit', '&:hover': { backgroundColor: 'action.hover' }, borderRadius: 1, padding: '8px' }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={`${event.startTime} - ${event.endTime} (${room?.name || 'Unknown Room'})`}
                    primaryTypographyProps={{ sx: { fontWeight: 'medium' } }}
                  />
                </Link>
              </ListItem>
            );
          })}
          {events.length === 0 && date && (
            <ListItem>
              <ListItemText primary="No events for this day." />
            </ListItem>
          )}
        </List>
      </Box>
    </Popover>
  );
};

export default EventPopover;