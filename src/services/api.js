import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Axios instance with interceptors for authentication
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

/**
 * Request interceptor - Add access token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().getAccessToken()
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle token refresh on 401 errors
 */
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = useAuthStore.getState().getRefreshToken()

      if (!refreshToken) {
        // No refresh token, logout
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken } = response.data

        // Update the access token in store
        useAuthStore.getState().setAccessToken(accessToken)

        // Update the failed requests
        processQueue(null, accessToken)

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout
        processQueue(refreshError, null)
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

/**
 * API Service Object
 * Contains all API methods organized by resource
 */
const api = {
  // Authentication
  auth: {
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),
    logout: () => apiClient.post('/auth/logout'),
    refresh: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
  },

  // User Profile
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data) => apiClient.put('/users/profile', data),
    changePassword: (data) => apiClient.put('/users/password', data),
  },

  // Appointments
  appointments: {
    getAll: (params) => apiClient.get('/appointments', { params }),
    getById: (id) => apiClient.get(`/appointments/${id}`),
    create: (data) => apiClient.post('/appointments', data),
    update: (id, data) => apiClient.put(`/appointments/${id}`, data),
    cancel: (id, reason) => apiClient.delete(`/appointments/${id}`, { data: { reason } }),
  },

  // Medications
  medications: {
    getAll: (params) => apiClient.get('/medications', { params }),
    getById: (id) => apiClient.get(`/medications/${id}`),
    create: (data) => apiClient.post('/medications', data),
    update: (id, data) => apiClient.put(`/medications/${id}`, data),
    delete: (id) => apiClient.delete(`/medications/${id}`),
    logMedication: (id, data) => apiClient.post(`/medications/${id}/log`, data),
  },

  // Notifications
  notifications: {
    getAll: (params) => apiClient.get('/notifications', { params }),
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/read-all'),
    delete: (id) => apiClient.delete(`/notifications/${id}`),
  },

  // Doctors (for appointment booking)
  doctors: {
    getAll: (params) => apiClient.get('/doctors', { params }),
    getById: (id) => apiClient.get(`/doctors/${id}`),
  },
}

export default api
