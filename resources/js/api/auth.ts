import axiosClient from "../utils/axios";

export const getCrfCookie = async () => {
  return axiosClient.get('/sanctum/csrf-cookie');
}

export const login = async(email: string, password: string) => {
  await getCrfCookie();
  // return axiosClient.post('/api/auth/login', { email, password });

  const response = await axiosClient.post('/api/auth/login', { email, password });
  const token = response.data.token;

  // Save the token
  axiosClient.defaults.headers['Authorization'] = `Bearer ${token}`;
  return response.data;
}

export const logout = async () => {
  return axiosClient.post('/api/auth/logout');
};

export const getProfile = async () => {
  return axiosClient.get('/api/user', { withCredentials: true });  // This will use the authenticated session
};

// export const getProfile = async () => {
//   try {
//     // Ensure CSRF cookie is retrieved before making authenticated requests
//     await getCrfCookie();

//     // Make the request to get the profile information
//     const response = await axiosClient.get('/api/user');

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     throw error;
//   }
// };