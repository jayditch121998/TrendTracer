import axiosClient from "../utils/axios";

export const getCrfCookie = async () => {
  return axiosClient.get('/sanctum/csrf-cookie');
}

export const login = async(email: string, password: string) => {
  await getCrfCookie();
  return axiosClient.post('/api/auth/login', { email, password });
}

export const logout = async () => {
  return axiosClient.post('/api/auth/logout');
};