import React from 'react';
import { Stack, Divider, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

interface CalendarHeaderProps {
  view: 'day' | 'month';
  currentDate: Date;
  onViewChange: (event: React.MouseEvent<HTMLElement>, newView: 'day' | 'month' | null) => void;
  onDateNavigate: (direction: 'prev' | 'next') => void;
  onCreateClick: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  currentDate,
  onViewChange,
  onDateNavigate,
  onCreateClick,
}) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1, sm: 2 }}
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 2 }}
    >
      <Button
        variant="contained"
        onClick={onCreateClick}
        size="small"
        sx={{ width: 'auto', minWidth: 'auto', px: 2, order: { xs: 3, sm: 1 } }}
      >
        + Create
      </Button>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ order: { xs: 1, sm: 2 }, flexGrow: { xs: 1, sm: 0 }, justifyContent: 'center' }}>
        <Button onClick={() => onDateNavigate('prev')} size="small">{'<'}</Button>
        <Typography variant="h6" component="div" sx={{ textAlign: 'center', minWidth: { xs: '150px', sm: '180px' }, userSelect: 'none' }}>
          {view === 'day'
            ? currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
        <Button onClick={() => onDateNavigate('next')} size="small">{'>'}</Button>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ order: { xs: 2, sm: 3 } }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={onViewChange}
          aria-label="calendar view"
          size="small"
        >
          <ToggleButton value="day" aria-label="day view">Day</ToggleButton>
          <ToggleButton value="month" aria-label="month view">Month</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
};

export default CalendarHeader;