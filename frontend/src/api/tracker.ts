import api from "./axios";

export async function addFood(userId: number, body: {
  date: string;
  food_name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}) {
  const { data } = await api.post(`/v1/users/${userId}/foods`, body);
  return data;
}

export async function getFoods(userId: number) {
  const { data } = await api.get(`/v1/users/${userId}/foods`);
  return data;
}

export async function addExercise(userId: number, body: {
  date: string;
  exercise_name: string;
  duration_min: number;
  calories_burned: number;
}) {
  const { data } = await api.post(`/v1/users/${userId}/exercises`, body);
  return data;
}

export async function getExercises(userId: number) {
  const { data } = await api.get(`/v1/users/${userId}/exercises`);
  return data;
}
