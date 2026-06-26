import apiClient from "../utils/axios";

const TOKEN_KEY = "crm_token";
const USER_KEY = "crm_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const login = async (credentials) => {
  const { data } = await apiClient.post("/users/login", credentials);
  if (data.token) {
    saveToken(data.token);
  }
  if (data.user) {
    saveUser(data.user);
  }
  return data;
};

export const getProfile = async () => {
  const { data } = await apiClient.get("/test/profile");
  return data;
};

export const getCurrentUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(USER_KEY);
    }
  }

  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};
