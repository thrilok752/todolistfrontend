// src/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API = {
  loginform: `${API_BASE_URL}/api/auth/jwt/create/`,
  passwordchange: `${API_BASE_URL}/api/auth/users/set_password/`,
  passwordforgot: `${API_BASE_URL}/api/auth/users/reset_password/`,
  passwordresetform:  `${API_BASE_URL}/api/auth/users/reset_password_confirm/`,
  registerform: `${API_BASE_URL}/api/auth/users/`,
  todolf:  `${API_BASE_URL}/api/todoapp/todolist/`,
};