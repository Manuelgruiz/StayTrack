import api from "./axios";

export type DailyStat = {
  date: string;
  kcal_in: number;
  kcal_out: number;
  protein_in: number;
  fat_in: number;
  carbs_in: number;
};

export async function getDailyStats(userId: number, from: string, to: string) {
  const { data } = await api.get(`/v1/users/${userId}/stats/daily`, {
    params: { from, to },
  });
  return data as DailyStat[];
}

export async function getSummary(userId: number, day: string) {
  const { data } = await api.get(`/v1/users/${userId}/stats/summary`, {
    params: { day },
  });
  return data;
}
