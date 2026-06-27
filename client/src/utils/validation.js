export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

export const isPhone = (value) => /^[0-9+\-\s()]{7,20}$/.test(String(value || "").trim());

export const required = (value) => String(value || "").trim().length > 0;

export const minLength = (value, length) => String(value || "").length >= length;
