import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  API_KEY: 'funbox_api_key',
  ONBOARDING_COMPLETE: 'funbox_onboarding_complete',
  USERNAME: 'funbox_username',
  THEME_MODE: 'funbox_theme_mode',
};

export interface StorageData {
  apiKey?: string;
  isOnboardingComplete?: boolean;
  username?: string;
  themeMode?: 'light' | 'dark';
}

export const setApiKey = async (apiKey: string): Promise<void> => {
  try {
    apiKey= "AIzaSyD4HctnmJarBhSJPrpZHC5yTCxM45mU2lw"
    await SecureStore.setItemAsync(STORAGE_KEYS.API_KEY, apiKey);
    console.log('API key saved securely');
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

export const getApiKey = async (): Promise<string | null> => {
  try {
    const apiKey = await SecureStore.getItemAsync(STORAGE_KEYS.API_KEY);
    return apiKey;
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

// Onboarding Management
export const setOnboardingComplete = async (isComplete: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, JSON.stringify(isComplete));
  } catch (error) {
    console.error('Error saving onboarding status:', error);
    throw error;
  }
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

// Username Management
export const setUsername = async (username: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
  } catch (error) {
    console.error('Error saving username:', error);
    throw error;
  }
};

export const getUsername = async (): Promise<string | null> => {
  try {
    const username = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
    return username;
  } catch (error) {
    console.error('Error retrieving username:', error);
    return null;
  }
};

// Theme Management
export const setThemeMode = async (themeMode: 'light' | 'dark'): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
  } catch (error) {
    console.error('Error saving theme mode:', error);
    throw error;
  }
};

export const getThemeMode = async (): Promise<'light' | 'dark'> => {
  try {
    const themeMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
    return themeMode as 'light' | 'dark' || 'light';
  } catch (error) {
    console.error('Error retrieving theme mode:', error);
    return 'light';
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.API_KEY);
    await AsyncStorage.clear();
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};