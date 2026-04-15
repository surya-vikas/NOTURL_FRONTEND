import api from "./api";

export const createShortUrl = async (payload) => {
  const requestPayload =
    typeof payload === "string" ? { originalUrl: payload } : { ...payload };
  const response = await api.post("/api/url", requestPayload);
  return response.data;
};

export const getUserUrls = async () => {
  const response = await api.get("/api/url");
  return response.data;
};

export const deleteUserUrl = async (id) => {
  const response = await api.delete(`/api/url/${id}`);
  return response.data;
};

export const updateUserUrl = async ({ id, originalUrl }) => {
  const response = await api.patch(`/api/url/${id}`, { originalUrl });
  return response.data;
};

export const toggleUserUrlStatus = async ({ id, isActive }) => {
  const response = await api.patch(`/api/url/${id}/status`, { isActive });
  return response.data;
};
