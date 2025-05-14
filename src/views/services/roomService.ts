const API_URL = 'http://localhost:3001/rooms';

export interface Room {
  id: string;
  name: string;
  location: string;
  timeStart: string;
  timeEnd: string;
  image: string;
}

export const getRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    return await response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};