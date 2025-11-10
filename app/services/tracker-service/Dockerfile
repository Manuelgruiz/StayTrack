# ---- base ----
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Instala dependencias primero para aprovechar caché
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el servicio
COPY . .

EXPOSE 8000

ENV HOST=0.0.0.0 \
    PORT=8000 \
    WORKERS=1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
