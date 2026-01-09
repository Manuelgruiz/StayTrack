import api from "./axios";

export type CatalogFood = {
    id: number;
    name: string;
    kcal_100g: number;
    protein_100g: number;
    fat_100g: number;
    carbs_100g: number;
    label: string;
    grams: number; // default serving size
};

export async function searchCatalog(query: string) {
    const { data } = await api.get("/v1/foods", {
        params: { q: query, limit: 10 },
    });
    return data as CatalogFood[]; // Assuming backend returns [ ... ]
}

export async function getFoodDetails(foodId: number) {
    const { data } = await api.get(`/v1/foods/${foodId}`);
    return data as CatalogFood;
}

export type CreateFoodPayload = {
    name: string;
    kcal_100g: number;
    protein_100g: number;
    fat_100g: number;
    carbs_100g: number;
    label?: string;
    grams?: number;
};

export async function createCatalogFood(food: CreateFoodPayload) {
    const { data } = await api.post("/v1/foods", food);
    return data as CatalogFood;
}
