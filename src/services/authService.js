import api, { authPath } from "./api";

export const loginWithEmail = async ({ email, password }) => {
  const response = await api.post(authPath("/login"), {
    email,
    password,
  });
  return response.data;
};

export const sendOtp = async ({ email }) => {
  const response = await api.post(authPath("/send-otp"), { email });
  return response.data;
};

export const verifyOtp = async ({ email, otp, name, phone }) => {
  const response = await api.post(authPath("/verify-otp"), {
    email,
    otp,
    name,
    phone,
  });
  return response.data;
};

export const loginWithGoogle = async (credential) => {
  const response = await api.post(authPath("/google-login"), {
    token: credential,
  });
  return response.data;
};
