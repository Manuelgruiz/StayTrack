# ---- base ----
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Optimiza caché: copia solo requirements primero
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del servicio
COPY . .

# Puerto interno del contenedor
EXPOSE 8000

# Variables opcionales (puedes sobreescribir por env en docker-compose)
ENV HOST=0.0.0.0 \
    PORT=8000 \
    WORKERS=1

# Lanza el servicio
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
