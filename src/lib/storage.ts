// localStorage utilities
export const getToken = () => localStorage.getItem("auth_token");
export const setToken = (token: string) =>
  localStorage.setItem("auth_token", token);
export const removeToken = () => localStorage.removeItem("auth_token");

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const setUser = (user: unknown) =>
  localStorage.setItem("user", JSON.stringify(user));
export const removeUser = () => localStorage.removeItem("user");
