export const canManageEverything = (user) => user?.role === "ADMIN";

export const canCreateLeads = (user) => ["ADMIN", "MANAGER"].includes(user?.role);

export const canAssignLeads = (user) => ["ADMIN", "MANAGER"].includes(user?.role);

export const canDeleteLeads = (user) => user?.role === "ADMIN";

export const canManageUsers = (user) => ["ADMIN", "MANAGER"].includes(user?.role);

export const canDeleteUsers = (user) => user?.role === "ADMIN";

export const allowedUserRolesToCreate = (user) => {
  if (user?.role === "ADMIN") return ["ADMIN", "MANAGER", "SALES"];
  if (user?.role === "MANAGER") return ["SALES"];
  return [];
};
