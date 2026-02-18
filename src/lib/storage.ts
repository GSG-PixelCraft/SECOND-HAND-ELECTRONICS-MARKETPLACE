// localStorage utilities
import { STORAGE_KEYS } from "../constants";

export const getToken = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
export const setToken = (token: string) =>
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
export const removeToken = () =>
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};
export const setUser = (user: unknown) =>
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
export const removeUser = () => localStorage.removeItem(STORAGE_KEYS.USER);

export const getVerification = () => {
  const verification = localStorage.getItem(STORAGE_KEYS.VERIFICATION);
  return verification ? JSON.parse(verification) : null;
};
export const setVerification = (verification: unknown) =>
  localStorage.setItem(STORAGE_KEYS.VERIFICATION, JSON.stringify(verification));
export const removeVerification = () =>
  localStorage.removeItem(STORAGE_KEYS.VERIFICATION);
