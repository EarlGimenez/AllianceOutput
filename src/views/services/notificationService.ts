const API_URL = 'https://localhost:59453/api/notifications';

export interface Notification {
  notificationId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateNotification {
  title: string;
  message: string;
  type: string;
  relatedEntityId?: string;
  createdBy?: string;
}

/**
 * Get all notifications
 */
export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
};

/**
 * Get unread notifications
 */
export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_URL}/unread`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch unread notifications');
  }

  return response.json();
};

/**
 * Get unread count
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/unread/count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch unread count');
  }

  const data = await response.json();
  return data.count;
};

/**
 * Get notification by ID
 */
export const getNotificationById = async (id: string): Promise<Notification> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notification');
  }

  return response.json();
};

/**
 * Create notification
 */
export const createNotification = async (data: CreateNotification): Promise<void> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create notification');
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/read-all`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }
};
