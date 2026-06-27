import apiClient from "../utils/axios";

export const getAuditLogs = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const { data } = await apiClient.get("/audit-logs", {
    params: { page, limit, search },
  });
  return data;
};
