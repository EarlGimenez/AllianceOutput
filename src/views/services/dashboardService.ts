const API_URL = 'https://localhost:59453/api/dashboard';

export interface DashboardStatistics {
  totalUsers: number;
  activeUsers: number;
  totalRooms: number;
  totalBookings: number;
  bounceRate: number;
  roomUsageRate: number;
  userActivity: MonthlyUserActivity[];
  roomUsageByType: RoomUsageByType[];
}

export interface MonthlyUserActivity {
  name: string;
  active: number;
  total: number;
}

export interface RoomUsageByType {
  name: string;
  value: number;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStatistics = async (): Promise<DashboardStatistics> => {
  const response = await fetch(`${API_URL}/statistics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard statistics');
  }

  return response.json();
};
