import apiClient from "../utils/axios";

export const uploadLeadsCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post("/csv/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
