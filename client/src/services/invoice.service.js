import apiClient from "../utils/axios";

export const getInvoices = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const { data } = await apiClient.get("/invoices", {
    params: { page, limit, search },
  });
  return data;
};

export const getInvoiceById = async (id) => {
  const { data } = await apiClient.get(`/invoices/${id}`);
  return data;
};

export const createInvoice = async (payload) => {
  const { data } = await apiClient.post("/invoices", payload);
  return data;
};

export const updateInvoice = async (id, payload) => {
  const { data } = await apiClient.put(`/invoices/${id}`, payload);
  return data;
};

export const deleteInvoice = async (id) => {
  const { data } = await apiClient.delete(`/invoices/${id}`);
  return data;
};

export const downloadInvoicePdf = async (id) => {
  const response = await apiClient.get(`/invoices/${id}/pdf`, {
    responseType: "blob",
  });
  return response;
};
