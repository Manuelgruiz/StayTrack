import api from "./axios";
import { parseJwt } from "./jwt";

export type RegisterPayload = {
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  password: string;
};

export async function register(body: RegisterPayload) {
  const { data } = await api.post("/v1/auth/register", body);
  // data: { access_token }
  localStorage.setItem("st_token", data.access_token);
  const payload = parseJwt(data.access_token);
  if (payload?.sub) localStorage.setItem("st_uid", payload.sub);
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post("/v1/auth/login", { email, password });
  localStorage.setItem("st_token", data.access_token);
  const payload = parseJwt(data.access_token);
  if (payload?.sub) localStorage.setItem("st_uid", payload.sub);
  return data;
}

export function logout() {
  localStorage.removeItem("st_token");
  localStorage.removeItem("st_uid");
}

export function isAuthed() {
  return !!localStorage.getItem("st_token");
}

export function currentUserId(): number | null {
  const sub = localStorage.getItem("st_uid");
  return sub ? Number(sub) : null;
}
