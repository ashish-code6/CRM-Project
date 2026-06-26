import apiClient from "../utils/axios";

export const sendTestEmail = async (to) => {
  const { data } = await apiClient.post("/email/test", { to });
  return data;
};
