import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/api/profile");
  return response.data;
};

export const sendProfileUpdateOtp = async () => {
  const response = await api.post("/api/profile/send-otp");
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await api.put("/api/profile", payload);
  return response.data;
};
