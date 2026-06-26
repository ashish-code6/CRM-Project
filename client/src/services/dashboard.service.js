import apiClient from "../utils/axios";

export const getDashboardStats = async () => {
  const { data } = await apiClient.get("/dashboard/stats");
  return data;
};
