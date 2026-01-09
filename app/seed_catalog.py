import httpx
import asyncio

# URL interna del servicio de catálogo (dentro del contenedor usa localhost:8000)
URL = "http://localhost:8000/v1/foods"

foods = [
    {"name": "Apple", "kcal_100g": 52, "protein_100g": 0.3, "fat_100g": 0.2, "carbs_100g": 14, "label": "Fruit", "grams": 150},
    {"name": "Banana", "kcal_100g": 89, "protein_100g": 1.1, "fat_100g": 0.3, "carbs_100g": 23, "label": "Fruit", "grams": 120},
    {"name": "Chicken Breast (Grilled)", "kcal_100g": 165, "protein_100g": 31, "fat_100g": 3.6, "carbs_100g": 0, "label": "Meat", "grams": 150},
    {"name": "White Rice (Cooked)", "kcal_100g": 130, "protein_100g": 2.7, "fat_100g": 0.3, "carbs_100g": 28, "label": "Grain", "grams": 200},
    {"name": "Egg (Large)", "kcal_100g": 155, "protein_100g": 13, "fat_100g": 11, "carbs_100g": 1.1, "label": "Dairy", "grams": 50},
    {"name": "Broccoli (Steamed)", "kcal_100g": 34, "protein_100g": 2.8, "fat_100g": 0.4, "carbs_100g": 7, "label": "Vegetable", "grams": 100},
    {"name": "Oats (Rolled)", "kcal_100g": 389, "protein_100g": 16.9, "fat_100g": 6.9, "carbs_100g": 66, "label": "Grain", "grams": 40},
    {"name": "Whole Milk", "kcal_100g": 60, "protein_100g": 3.2, "fat_100g": 3.25, "carbs_100g": 4.8, "label": "Dairy", "grams": 240},
    {"name": "Salmon (Raw)", "kcal_100g": 208, "protein_100g": 20, "fat_100g": 13, "carbs_100g": 0, "label": "Fish", "grams": 150},
    {"name": "Avocado", "kcal_100g": 160, "protein_100g": 2, "fat_100g": 15, "carbs_100g": 9, "label": "Fruit", "grams": 200},
    {"name": "Pasta (Cooked)", "kcal_100g": 131, "protein_100g": 5, "fat_100g": 1.1, "carbs_100g": 25, "label": "Grain", "grams": 150},
    {"name": "Greek Yogurt", "kcal_100g": 59, "protein_100g": 10, "fat_100g": 0.4, "carbs_100g": 3.6, "label": "Dairy", "grams": 170},
]

async def seed():
    print(f"Seeding catalog at {URL}...")
    async with httpx.AsyncClient() as client:
        for food in foods:
            try:
                # Intentamos crear. Si ya existe, dará error (probablemente 409 o 500), lo ignoramos.
                r = await client.post(URL, json=food)
                if r.status_code in [200, 201]:
                    print(f"[OK] Added {food['name']}")
                else:
                    print(f"[SKIP] {food['name']} (Status: {r.status_code})")
            except Exception as e:
                print(f"[ERR] Failed {food['name']}: {e}")

if __name__ == "__main__":
    asyncio.run(seed())
