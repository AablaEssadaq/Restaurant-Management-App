import { logout } from "@/store/authSlice.js";
import { store } from "@/store/index.js";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL_BASE;

let isLoggingOut = false;

// Custom error for different authentication scenarios
export class AuthError extends Error {
  constructor(type, message) {
    super(message);
    this.name = "AuthError";
    this.type = type; // 'token-expired' | 'unauthorized' | 'session-expired'
  }
}

// Create navigation handler that can be set from components
let navigationCallback = null;

export const setNavigationCallback = (callback) => {
  navigationCallback = callback;
};


// Then modify handleLogout:
export const handleLogout = async () => {
  if (!navigationCallback) {
    console.error('Navigation callback not set!');
    return;
  }

  // Immediately disable the auth interceptor by setting a flag
  window.__bypassAuthInterceptor = true;

  // Dispatch logout to clear auth state
  store.dispatch(logout());

  // Navigate to login immediately
  navigationCallback('/login');

  // Send the logout request without waiting for response
  try {
    await api.post('/api/auth/logout');
  } catch (error) {
    // Intentionally ignore errors during logout
    console.log('Logout API call completed with:', error?.response?.status || 'error');
  }

  // Reset the bypass flag after a delay
  setTimeout(() => {
    window.__bypassAuthInterceptor = false;
  }, 1000);
};

const handleAuthError = (error) => {
  if (!navigationCallback) {
    console.error('Navigation callback not set! Make sure to call setNavigationCallback.');
    return;
  }

  // If we're already navigating to login page (during logout), don't redirect elsewhere
  if (window.location.pathname === '/login') {
    store.dispatch(logout());
    return;
  }

  store.dispatch(logout());
  
  if (error.type === 'session-expired') {
    navigationCallback('/session-expired');
  } else {
    navigationCallback('/unauthorized');
  }
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async () => {
  try {
    console.log("🔄 Tentative de rafraîchissement du token...");
    const response = await axios.post(`${API_URL}/api/refresh-token`, {}, {
      withCredentials: true
    });
    console.log("✅ Token refreshed:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Refresh token request failed:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      if (error.response.data?.message?.includes('expired')) {
        throw new AuthError('session-expired', 'Your session has expired');
      } else {
        throw new AuthError('unauthorized', 'You are not authorized');
      }
    }
    throw error;
  }
};

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
     // Skip all auth error handling if bypass flag is set
    if (window.__bypassAuthInterceptor) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
     
     // Handle 401 errors
    if (error.response?.status === 401) {
      // Check if it's a token expiration or other auth error
      const isTokenError = error.response.data?.message?.includes('token') || error.response.data?.message?.includes('expired');
      
      if (!isTokenError) {
        // This is a regular unauthorized error, not a token issue
        handleAuthError(new AuthError('unauthorized', 'You are not authorized to access this resource'));
        return Promise.reject(error);
      }

      // Don't retry if we've already tried once
      if (originalRequest._retry) {
        handleAuthError(new AuthError('session-expired', 'Your session has expired'));
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await refreshAccessToken();
          isRefreshing = false;
          processQueue(null);
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);
          
          if (refreshError instanceof AuthError) {
            handleAuthError(refreshError);
          }
          return Promise.reject(refreshError);
        }
      }

      // Si un refresh est déjà en cours, mettre la requête en file d'attente
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(() => {
        return api(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}
);

export default api;