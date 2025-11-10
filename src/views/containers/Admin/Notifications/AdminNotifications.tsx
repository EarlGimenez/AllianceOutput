import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Pagination,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { AdminSidebar } from '../../../components/AdminSidebar';
import {
  getAllNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification,
} from '../../../services/notificationService';

type FilterType = 'all' | 'unread' | 'read';
type NotificationType = 'all' | 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'user_registered';

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [notificationType, setNotificationType] = useState<NotificationType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    byType: {
      booking_created: 0,
      booking_updated: 0,
      booking_cancelled: 0,
      user_registered: 0,
    },
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notifications, filterType, notificationType, searchQuery, sortOrder]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllNotifications();
      setNotifications(data);
      calculateStats(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Notification[]) => {
    const total = data.length;
    const unread = data.filter(n => !n.isRead).length;
    const byType = {
      booking_created: data.filter(n => n.type === 'booking_created').length,
      booking_updated: data.filter(n => n.type === 'booking_updated').length,
      booking_cancelled: data.filter(n => n.type === 'booking_cancelled').length,
      user_registered: data.filter(n => n.type === 'user_registered').length,
    };
    setStats({ total, unread, byType });
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Filter by read/unread
    if (filterType === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filterType === 'read') {
      filtered = filtered.filter(n => n.isRead);
    }

    // Filter by notification type
    if (notificationType !== 'all') {
      filtered = filtered.filter(n => n.type === notificationType);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotifications(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_created':
        return <EventIcon sx={{ color: '#1976d2' }} />;
      case 'booking_updated':
        return <EditIcon sx={{ color: '#0288d1' }} />;
      case 'booking_cancelled':
        return <DeleteIcon sx={{ color: '#d32f2f' }} />;
      case 'user_registered':
        return <PersonAddIcon sx={{ color: '#388e3c' }} />;
      default:
        return <EventIcon />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      booking_created: 'Booking Created',
      booking_updated: 'Booking Updated',
      booking_cancelled: 'Booking Cancelled',
      user_registered: 'New User',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      booking_created: 'primary',
      booking_updated: 'info',
      booking_cancelled: 'error',
      user_registered: 'success',
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Pagination
  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  if (loading) {
    return (
      <AdminSidebar>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress size={60} />
        </Box>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all system notifications
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Notifications
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Unread
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#e65100' }}>
                  {stats.unread}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Bookings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.byType.booking_created + stats.byType.booking_updated + stats.byType.booking_cancelled}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  New Users
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.byType.user_registered}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterListIcon />
            <Typography variant="h6">Filters</Typography>
          </Box>

          <Grid container spacing={2}>
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Type Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Notification Type</InputLabel>
                <Select
                  value={notificationType}
                  label="Notification Type"
                  onChange={(e) => setNotificationType(e.target.value as NotificationType)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="booking_created">Booking Created</MenuItem>
                  <MenuItem value="booking_updated">Booking Updated</MenuItem>
                  <MenuItem value="booking_cancelled">Booking Cancelled</MenuItem>
                  <MenuItem value="user_registered">New User</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Sort Order */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortOrder}
                  label="Sort By"
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Mark all as read">
                  <Button
                    variant="outlined"
                    startIcon={<MarkEmailReadIcon />}
                    onClick={handleMarkAllAsRead}
                    disabled={stats.unread === 0}
                    fullWidth
                  >
                    Mark All Read
                  </Button>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>

          {/* Filter Tabs */}
          <Box sx={{ mt: 3 }}>
            <Tabs
              value={filterType}
              onChange={(_, newValue) => setFilterType(newValue as FilterType)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label={`All (${stats.total})`} value="all" />
              <Tab label={`Unread (${stats.unread})`} value="unread" />
              <Tab label={`Read (${stats.total - stats.unread})`} value="read" />
            </Tabs>
          </Box>
        </Paper>

        {/* Notifications List */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {filteredNotifications.length} Notification{filteredNotifications.length !== 1 ? 's' : ''}
          </Typography>

          {paginatedNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <DeleteSweepIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No notifications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {paginatedNotifications.map((notification, index) => (
                <Box key={notification.notificationId}>
                  <Paper
                    elevation={notification.isRead ? 0 : 2}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                      border: '1px solid',
                      borderColor: notification.isRead ? 'divider' : 'primary.light',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                  >
                    {/* Icon */}
                    <Box sx={{ pt: 0.5 }}>
                      {getNotificationIcon(notification.type)}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          label={getTypeLabel(notification.type)}
                          size="small"
                          color={getTypeColor(notification.type) as any}
                          sx={{ height: 20 }}
                        />
                        {!notification.isRead && (
                          <Chip
                            label="New"
                            size="small"
                            color="error"
                            sx={{ height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Stack direction="row" spacing={1}>
                      {!notification.isRead && (
                        <Tooltip title="Mark as read">
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(notification.notificationId)}
                            color="primary"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(notification.notificationId)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Paper>
                  {index < paginatedNotifications.length - 1 && <Divider />}
                </Box>
              ))}
            </Stack>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Paper>
      </Box>
    </AdminSidebar>
  );
};

export default AdminNotifications;
