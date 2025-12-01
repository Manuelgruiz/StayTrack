import api from "./axios";

export async function getDailyStats(userId: number, from: string, to: string) {
  const { data } = await api.get(`/v1/users/${userId}/stats/daily`, {
    params: { _from: from, to },
  });
  return data as Array<{ date: string; kcal_in: number }>;
}

export async function getSummary(userId: number, day: string) {
  const { data } = await api.get(`/v1/users/${userId}/stats/summary`, {
    params: { day },
  });
  return data;
}
