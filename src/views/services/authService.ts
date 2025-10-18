const API_URL = 'https://localhost:59453/api/users';

export interface User {
  userId: string;  // Changed from userID to userId to match .NET's camelCase serialization
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  company?: string;
  isActive: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  company?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  company?: string;
  isActive: boolean;
  password?: string;  // Optional - only if changing password
}

// ============================================
// AUTHENTICATION OPERATIONS
// ============================================

export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const login = async (data: LoginData): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// ============================================
// USER QUERY OPERATIONS
// ============================================

export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/by-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

export const getUserByUsername = async (username: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/by-username?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// ============================================
// USER CRUD OPERATIONS
// ============================================

export const createUser = async (data: RegisterData): Promise<User> => {
  // This is the same as register, but provided for consistency
  return register(data);
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
