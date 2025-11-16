import axios, { AxiosError, AxiosInstance } from "axios";

let accessToken: string | null = null; // You can replace this with Redux/Zustand/etc

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const api: AxiosInstance = axios.create({
  baseURL: "https://your-api.com/api",
  withCredentials: true, // Important so cookies (refresh token) are sent automatically
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle 401s and refresh token automatically
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use((response) => response, async (error: AxiosError) =>
    {
    const originalRequest = error.config!;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the failed request until the refresh is done
        return new Promise((resolve, reject) => {

          failedQueue.push({ resolve, reject });
        }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          "https://your-api.com/api/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
