const API_URL = 'https://localhost:59453/api/contact';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

/**
 * Send contact form data to the backend
 * The backend will send an email to earlreynan.gimenez.22@usjr.edu.ph
 */
export const sendContactMessage = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send contact message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};
