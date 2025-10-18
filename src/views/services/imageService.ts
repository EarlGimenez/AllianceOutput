const API_URL = 'https://localhost:59453/api/rooms';

export interface ImageUploadResponse {
  imagePath: string;
}

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
