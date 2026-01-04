// Use environment variable for API URL, fallback to /api for local development
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Types matching your backend schemas
export interface GolfRound {
  id: number;
  user_id: number;
  course_name: string;
  score: number;
  fairways_hit: number;
  total_fairways: number;
  greens_in_regulation: number;
  total_greens: number;
  total_putts: number;
  date: string;
}

export interface GolfRoundCreate {
  course_name: string;
  score: number;
  fairways_hit: number;
  total_fairways: number;
  greens_in_regulation: number;
  total_greens: number;
  total_putts: number;
  date?: string;
}

export interface YTDStats {
  fir_percentage: number;
  gir_percentage: number;
  average_putts: number;
  total_rounds: number;
}

// Get auth token from localStorage
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// API Functions
export const golfService = {
  // Register user
  async register(username: string, password: string) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  // Login
  async login(username: string, password: string) {
    // Clear any existing expired token before attempting login
    localStorage.removeItem('access_token');
    
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Incorrect username or password');
    }
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data;
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
  },

  // Check if logged in
  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  },

  // Create golf round
  async createRound(roundData: GolfRoundCreate): Promise<GolfRound> {
    const response = await fetch(`${API_URL}/rounds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(roundData),
    });
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      throw new Error('Session expired. Please login again.');
    }
    if (!response.ok) throw new Error('Failed to create round');
    return response.json();
  },

  // Get all rounds
  async getRounds(): Promise<GolfRound[]> {
    const response = await fetch(`${API_URL}/rounds`, {
      headers: getAuthHeader(),
    });
    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('access_token');
      throw new Error('Session expired. Please login again.');
    }
    if (!response.ok) throw new Error('Failed to fetch rounds');
    return response.json();
  },

  // Delete a round
  async deleteRound(roundId: number): Promise<void> {
    const response = await fetch(`${API_URL}/rounds/${roundId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to delete round');
  },

  // Get YTD stats
  async getYTDStats(): Promise<YTDStats> {
    const response = await fetch(`${API_URL}/stats/ytd`, {
      headers: getAuthHeader(),
    });
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      throw new Error('Session expired. Please login again.');
    }
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};