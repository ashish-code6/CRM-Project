import apiClient from "../utils/axios";

export const getLeads = async () => {
  const { data } = await apiClient.get("/leads");
  return data;
};

export const getLeadById = async (id) => {
  const { data } = await apiClient.get(`/leads/${id}`);
  return data;
};

export const createLead = async (payload) => {
  const { data } = await apiClient.post("/leads", payload);
  return data;
};

export const updateLead = async (id, payload) => {
  const { data } = await apiClient.put(`/leads/${id}`, payload);
  return data.lead || data;
};

export const deleteLead = async (id) => {
  const { data } = await apiClient.delete(`/leads/${id}`);
  return data;
};

export const assignLead = async (leadId, assignedToId) => {
  const { data } = await apiClient.patch(`/leads/${leadId}/assign`, { assignedToId });
  return data.lead || data;
};
