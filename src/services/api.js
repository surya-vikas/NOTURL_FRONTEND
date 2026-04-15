import axios from "axios";
import { API, AUTH_PREFIX } from "../config/env";
import { getToken } from "../utils/token";

let activeRequests = 0;
const loadingSubscribers = new Set();

const notifyLoadingSubscribers = () => {
  const loading = activeRequests > 0;
  loadingSubscribers.forEach((callback) => callback(loading));
};

const incrementLoading = () => {
  activeRequests += 1;
  notifyLoadingSubscribers();
};

const decrementLoading = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  notifyLoadingSubscribers();
};

const normalizePath = (path) => {
  const prefix = AUTH_PREFIX.endsWith("/") ? AUTH_PREFIX.slice(0, -1) : AUTH_PREFIX;
  return `${prefix}${path}`;
};

const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  incrementLoading();
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    decrementLoading();
    return response;
  },
  (error) => {
    decrementLoading();
    return Promise.reject(error);
  }
);

export const authPath = (path) => normalizePath(path);

export const getApiErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage || "Request failed";

export const isApiLoading = () => activeRequests > 0;

export const subscribeToApiLoading = (callback) => {
  if (typeof callback !== "function") {
    return () => {};
  }

  loadingSubscribers.add(callback);
  callback(activeRequests > 0);

  return () => {
    loadingSubscribers.delete(callback);
  };
};

export default api;
