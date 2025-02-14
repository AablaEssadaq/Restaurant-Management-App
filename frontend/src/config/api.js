import { logout } from "@/store/authSlice.js";
import { store } from "@/store/index.js";
import axios from "axios";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_URL_BASE;

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Variable pour suivre si un refresh est en cours
let isRefreshing = false;
// File d'attente pour les requêtes en attente pendant le refresh
let failedQueue = [];

// Fonction pour traiter la file d'attente
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

// Custom error for session expiration
export class SessionExpiredError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

// Fonction de refresh token
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
    // Check if it's a refresh token expiration
    if (error.response?.status === 401) {
      throw new SessionExpiredError();
    }
    throw error;
  }
};

// Intercepteur pour les requêtes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur n'est pas 401 ou la requête a déjà été retentée
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Marquer la requête comme retentée
    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        await refreshAccessToken();
        isRefreshing = false;
        processQueue(null);
        
        // Retenter la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        // If it's a session expiration, handle specially
        if (refreshError instanceof SessionExpiredError) {
          store.dispatch(logout());
          Navigate('/session-expired');
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
);

export default api;