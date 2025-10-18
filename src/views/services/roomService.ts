const API_URL = 'https://localhost:59453/api/rooms';
const BACKEND_URL = 'https://localhost:59453';  // Backend base URL for serving images

export interface Room {
  id: string;
  name: string;
  location: string;
  timeStart: string;
  timeEnd: string;
  purpose: string;
  image: string;
}

export interface CreateRoomData {
  name: string;
  location: string;
  timeStart: string;
  timeEnd: string;
  purpose: string;
  image?: string;
}

export interface UpdateRoomData {
  name: string;
  location: string;
  timeStart: string;
  timeEnd: string;
  purpose: string;
  image?: string;
}

export interface ImageUploadResponse {
  imagePath: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert relative image path to full backend URL
 * Example: "/uploads/rooms/abc.jpg" -> "https://localhost:59453/uploads/rooms/abc.jpg"
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;  // Already a full URL
  }
  // Remove leading slash if present, then prepend backend URL
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `${BACKEND_URL}/${cleanPath}`;
};

// ============================================
// ROOM QUERY OPERATIONS
// ============================================

export const getRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    const data = await response.json();
    
    // Map backend response to frontend format
    return data.map((room: any) => ({
      id: room.roomId,
      name: room.name,
      location: room.location,
      timeStart: room.timeStart,
      timeEnd: room.timeEnd,
      purpose: room.purpose,
      image: getImageUrl(room.imageUrl || '')  // Convert to full URL
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const getRoomById = async (id: string): Promise<Room> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch room');
    }
    const room = await response.json();
    
    // Map backend response to frontend format
    return {
      id: room.roomId,
      name: room.name,
      location: room.location,
      timeStart: room.timeStart,
      timeEnd: room.timeEnd,
      purpose: room.purpose,
      image: getImageUrl(room.imageUrl || '')  // Convert to full URL
    };
  } catch (error) {
    console.error('Error fetching room by ID:', error);
    throw error;
  }
};

// ============================================
// ROOM CRUD OPERATIONS
// ============================================

export const createRoom = async (data: CreateRoomData): Promise<void> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        location: data.location,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        purpose: data.purpose,
        imageUrl: data.image || ''  // Backend expects imageUrl
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create room');
    }
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const updateRoom = async (id: string, data: UpdateRoomData): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        location: data.location,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        purpose: data.purpose,
        imageUrl: data.image || ''  // Backend expects imageUrl
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update room');
    }
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

export const deleteRoom = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete room');
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

// ============================================
// IMAGE UPLOAD OPERATIONS
// ============================================

export const uploadRoomImage = async (file: File): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload-image`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, browser will set it automatically with boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};