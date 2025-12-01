FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del gateway
COPY . .

# Puerto interno
EXPOSE 8000

# Arrancar gateway (app.py -> variable app)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
