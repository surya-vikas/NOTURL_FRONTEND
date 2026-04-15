import api from "./api";

export const getAdminUsersLinks = async () => {
  const response = await api.get("/api/admin/users-links");
  return response.data;
};

export const updateAdminUserSuspension = async ({ id, isSuspended }) => {
  const response = await api.patch(`/api/admin/users/${id}/suspension`, {
    isSuspended,
  });
  return response.data;
};
