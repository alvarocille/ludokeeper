import { API_URL } from "@env";
import axios from "axios";

export async function login(username: string, password: string) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });

  return {
    access_token: response.data.access_token,
  };
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
}
