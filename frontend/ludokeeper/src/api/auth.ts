import { AUTH_API_URL } from "@env";
import axios from "axios";

export async function login(username: string, password: string) {
  const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
    username,
    password,
  });

  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const response = await axios.post(`${AUTH_API_URL}/auth/register`, data);
  return response.data;
}
