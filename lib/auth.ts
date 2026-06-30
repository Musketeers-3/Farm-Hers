import { authAPI } from './api';

export interface UserProfile {
  uid: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  role: "farmer" | "buyer";
  farmSize?: string;
  primaryCrop?: string;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Token management
export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

// Sign up — creates user + saves profile to MongoDB
export async function signUp(
  email: string,
  password: string,
  profile: Omit<UserProfile, "uid" | "createdAt">
): Promise<UserProfile> {
  // Use phone as email if no email provided
  const authEmail = email || `${profile.phone}@agrilink.app`;

  const response = await authAPI.register({
    email: authEmail,
    password,
    fullName: profile.fullName,
    phone: profile.phone,
    location: profile.location,
    role: profile.role,
    farmSize: profile.farmSize,
    primaryCrop: profile.primaryCrop,
  });

  if (!response.token) {
    throw new Error(response.error || 'Registration failed');
  }

  // Store token
  setToken(response.token);

  // Store user profile for persistence across refreshes
  setUserProfile(response.user);

  return response.user;
}

// Login — signs in with credentials + fetches profile
export async function login(
  emailOrPhone: string,
  password: string
): Promise<UserProfile> {
  const response = await authAPI.login({
    emailOrPhone,
    password,
  });

  if (!response.token) {
    throw new Error(response.error || 'Invalid credentials');
  }

  // Store token
  setToken(response.token);

  // Store user profile for persistence across refreshes
  setUserProfile(response.user);

  return response.user;
}

// Logout
export async function logout(): Promise<void> {
  removeToken();
}

// Fetch user profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const response = await authAPI.getProfile();
    if (response.error) {
      return null;
    }
    return response;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

// Store user profile in localStorage
export function setUserProfile(profile: UserProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }
}

// Get user profile from localStorage
export function getStoredUserProfile(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return null;
}

// Clear user profile from localStorage
export function clearUserProfile() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userProfile');
  }
}