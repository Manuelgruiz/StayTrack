# 🧩 Hito 4 – Composición de Servicios con Docker y GitHub Packages
**Proyecto:** StayTrack – Microservicios en Docker

---

## Índice
- [Resumen](#resumen)  
- [Estructura del clúster](#estructura-del-clúster)  
- [Justificación del Dockerfile y contenedor base](#justificación-del-dockerfile-y-contenedor-base)  
- [Dockerfiles de microservicios (ejemplo)](#dockerfiles-de-microservicios-ejemplo)  
- [Contenedores en GitHub Packages & CI/CD](#contenedores-en-github-packages--cicd)  
- [compose.yaml (documentado)](#composeyaml-documentado)  
- [Tests y CI de pruebas](#tests-y-ci-de-pruebas)  
- [Conclusión](#conclusión)

---

## Resumen
Despliegue de la aplicación completa mediante un clúster de microservicios con Docker Compose. Cada servicio corre en un contenedor aislado y se comunican a través de una red Docker compartida. Persistencia de datos mediante volumen.

---

## Estructura del clúster
Servicios incluidos:
- Gateway (FastAPI + router)
- Auth service
- User service
- Catalog service
- Goals service
- Stats service
- Tracker service
- Postgres (contenedor de datos)
- Volumen persistente: `db_data`
- Red interna compartida: `backend`

Beneficios:
- Reproducibilidad
- Independencia de microservicios
- Fácil despliegue local y en la nube
- Persistencia entre reinicios

---

## Justificación del Dockerfile y contenedor base
Imagen base utilizada por todos los microservicios:
`python:3.11-slim`

Motivos:
- Imagen oficial, segura y mantenida.
- Versión slim reduce tamaño y tiempos de transferencia.
- Contiene herramientas necesarias para instalar dependencias Python.
- Facilita contenedores ligeros y reproducibles.

Cada Dockerfile incluye:
- Instalación de dependencias desde `requirements.txt`
- Copia del código del microservicio
- `WORKDIR` configurado
- Ejecución con Uvicorn

---

## Dockerfiles de microservicios (ejemplo)
Ruta típica:
- `app/services/<microservicio>/Dockerfile`
- `app/gateway/Dockerfile`

Ejemplo estándar:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Contenedores publicados en GitHub Packages + CI/CD
Imágenes publicadas en GitHub Container Registry:
- [log](../screenshots/packages.png)

Workflow de publicación:
- `.github/workflows/docker-images.yml`
- Usa matrix para compilar cada imagen
- Publica en GHCR con etiquetas:
    - `latest`
    - SHA del commit



El workflow se ejecuta en cada push a `master` (configurable).

---

## compose.yaml (documentado)
El `compose.yaml` principal:
- Construye la base de datos
- Crea volumen para persistencia (`db_data`)
- Levanta todos los microservicios
- Define variables de entorno
- Conecta todo en la red `backend`
- Expone el gateway en `localhost:8000`

Ejemplo de secciones clave:
```yaml
version: "3.8"

services:
    db:
        image: postgres:14
        environment:
            POSTGRES_USER: appuser
            POSTGRES_PASSWORD: apppass
            POSTGRES_DB: appdb
        volumes:
            - db_data:/var/lib/postgresql/data
        networks:
            - backend

    gateway:
        image: ghcr.io/manuelgruiz/staytrack-gateway:latest
        ports:
            - "8000:8000"
        depends_on:
            - user-service
            - tracker-service
        networks:
            - backend

    user-service:
        image: ghcr.io/manuelgruiz/staytrack-user-service:latest
        environment:
            DB_HOST: db
            DB_NAME: appdb
            DB_USER: appuser
            DB_PASS: apppass
        networks:
            - backend

volumes:
    db_data:

networks:
    backend:
        driver: bridge
```

Notas:
- Los servicios usan `DB_HOST=db` (no `localhost`).
- El volumen `db_data` persiste los datos entre reinicios.

---

## Tests del clúster (CI automatizado)
Workflow de tests:
- `.github/workflows/tests.yml`
- Ejecuta `pytest` para cada microservicio (matrix)
- Instala dependencias por servicio
- Simula entornos usando SQLite para evitar Postgres en CI
- Se ejecuta en push, PR y manualmente

Objetivo: validar que cada microservicio funciona independientemente del entorno real.

---

## Conclusión
El proyecto cumple los requisitos del Hito 4:
- Infraestructura reproducible con Docker Compose
- Contenedores ligeros y consistentes
- Imágenes en GitHub Packages
- CI/CD automático para build & publish
- Tests automatizados por servicio
- Volumen persistente y BBDD aislada
- Clúster funcional completo
