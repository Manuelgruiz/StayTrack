import api from "./axios";

export type Goal = {
    id?: number;
    user_id?: number;
    kcal_per_day: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
    exercise_min_per_week: number;
    target_weight: number;
};

export async function getGoals(userId: number) {
    try {
        const { data } = await api.get(`/v1/users/${userId}/goals`);
        return data as Goal;
    } catch (err: any) {
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
}

export async function updateGoals(userId: number, goals: Goal) {
    const { data } = await api.put(`/v1/users/${userId}/goals`, goals);
    return data as Goal;
}
