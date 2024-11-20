import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = 'https://backup.dsmacademy.in/api';

const isElectron = () => {
  return typeof window !== 'undefined' && window.process && window.process.type;
};


export const LoginApi = async (cb, postdata) => {
  try {
    console.log("Attempting login with data:", postdata);
    
    const response = await axios.post(`${API_BASE_URL}/login`, postdata);
    console.log("API Response:", response.data);

    if (response.data?.success) {
      await AsyncStorage.setItem('@USER_TOKEN', response.data.data.token);
      await AsyncStorage.setItem('@COMPANY_ID', response.data.data._id);
      await AsyncStorage.setItem('@COMPANY_NAME', response.data.data.companyName);
      cb && cb(false, 'success');  // Indicate success

      if (Platform.OS === 'web') {
        window.location.reload();  // Reload for web environment
      } else if (isElectron()) {
        const { remote } = window.require('electron');
        remote.getCurrentWindow().reload();  // Reload the Electron desktop window
      }
    } else {
      cb && cb(false, 'error', response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error("Login API Error:", error);
    
    if (error.response) {
      console.error("Error response data:", error.response.data);
      cb && cb(false, 'error', `Server error: ${error.response.status}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      cb && cb(false, 'error', 'No response from server');
    } else {
      console.error("Error message:", error.message);
      cb && cb(false, 'error', 'Request setup error');
    }
  }
};