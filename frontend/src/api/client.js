import axios from 'axios';

// base instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables to handle multiple simultaneous requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor, Attach Access Token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const bypassToken = urlParams.get('maintenance_bypass');
      if (bypassToken) {
        config.params = { ...config.params, maintenance_bypass: bypassToken };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor, Catch 401s and Silent Refresh
apiClient.interceptors.response.use(
  (response) => response, async (error) => {
    if (!error || !error.config) {
      return Promise.reject(error);
    }

    if (error.response?.status === 503 && error.response?.data?.isMaintenance) {
      window.dispatchEvent(
        new CustomEvent('system:maintenance', {
          detail: error.response.data
        })
      );
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Reject immediately if error is not 401, or if it's already retried, or if it's an auth endpoint
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/admin-login') ||
      originalRequest.url.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${apiClient.defaults.baseURL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = data.data.accessToken;

      // Save the new token
      localStorage.setItem('accessToken', newAccessToken);

      // Update headers for future requests and the current failed request
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

      // Process all queued requests with the new token
      processQueue(null, newAccessToken);

      // Retry the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed (token expired or tampered)
      processQueue(refreshError, null);

      // Wipe local storage 
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Dispatch global event so React Router can intercept and redirect
      window.dispatchEvent(new Event('auth:logout'));

      return Promise.reject(refreshError);
    } finally {
      // Release the lock
      isRefreshing = false;
    }
  }
);

export default apiClient;