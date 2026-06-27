import apiClient from "../utils/axios";

export const getUsers = async ({ page = 1, limit = 10, role = "", all = false } = {}) => {
  const { data } = await apiClient.get("/users", {
    params: { page, limit, role, all },
  });
  return data;
};

export const createUser = async (payload) => {
  const { data } = await apiClient.post("/users", payload);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/users/${id}`);
  return data;
};
