# Hito 3 – Diseño de Microservicios

**Alumno:** Manuel García Ruiz  
**Email:** manuelgruiz22@gmail.com

**Proyecto:** StayTrack

## 🎯 Objetivo del hito
Diseñar, documentar y testear la arquitectura completa de microservicios del proyecto StayTrack.  
Cada microservicio debe exponer una API REST, contar con tests exhaustivos, registrar actividad mediante logs y funcionar de manera independiente y desacoplada. Además, integrar ejecución automatizada mediante Makefile y GitHub Actions para validar cada servicio por separado.

## 🧰 Tecnologías y dependencias utilizadas

| Tipo | Herramienta / Librería | Versión | Propósito |
|---|---:|:---:|---|
| Framework web | FastAPI | 0.115.x | Desarrollo de APIs REST |
| Servidor ASGI | Uvicorn | 0.30.x | Servidor para microservicios |
| Validación | Pydantic | 2.9.x | Validación de datos |
| ORM | SQLAlchemy | 2.0.x | Modelos y persistencia |
| Hashing | Passlib[bcrypt] | — | Seguridad de contraseñas |
| Cliente HTTP | HTTPX | — | Comunicación entre microservicios y testing |
| Tests | Pytest | — | Framework principal de pruebas |
| Mock HTTP | respx | — | Simulación de microservicios externos |
| Logs | logging | Python stdlib | Registro de actividad |
| Entornos | python-dotenv | 1.0.x | Variables de entorno |
| CI/CD | GitHub Actions | — | Ejecución automática de tests |
| Base de datos pruebas | SQLite | — | DB en memoria para testing |
| Gestor tareas | Makefile | — | Estandarizar ejecución de test por servicio |

## ✅ Justificación del framework: FastAPI
- Alto rendimiento (ASGI/Starlette), adecuado para múltiples peticiones concurrentes.  
- Validación estricta con Pydantic, crucial en microservicios.  
- Tipado fuerte y documentación automática (OpenAPI/Swagger).  
- Inyección de dependencias para desacoplar API, lógica y datos.  
- Buen soporte para testing (TestClient).

## ✅ Diseño de la API, rutas, tests y arquitectura por capas

Estructura general:
```
app/
 └── services/
    ├── auth-service
    ├── user-service
    ├── catalog-service
    ├── goals-service
    ├── tracker-service
    └── stats-service
 └── gateway/
docs/
frontend/
Makefile
.github/workflows/test.yml
requirements.txt
```

Cada servicio contiene:
```
app/
 ├── main.py          → middlewares y montaje de rutas
 ├── router.py        → rutas REST
 ├── service_*.py     → lógica de negocio
 ├── models.py        → ORM SQLAlchemy
 ├── schemas.py       → Pydantic
 ├── db.py            → acceso a datos + dependencia get_db()
 └── logger.py        → configuración de logs
tests/
 ├── conftest.py      → setup BD aislada por servicio
 └── test_*.py        → tests funcionales de API
```

Separación por capas:
- API: router.py — recibe petición y delega.  
- Servicio: service_*.py — lógica de negocio.  
- Persistencia: db.py — Engine, SessionLocal, get_db().  
- Modelos: models.py — declaraciones ORM.  
- Validación: schemas.py — entrada/salida.  
- Logs: logger.py — registro de actividad.

## 🧩 Microservicios implementados

- [Microservicios](../screenshots/arquitectura.png)

1. Auth-service
   - Registro, login, generación de JWT, hashing bcrypt.
   - Validaciones y limitación de contraseñas (>72 bytes).

2. User-service
   - Crear, leer y listar usuarios.
   - DB real: PostgreSQL; DB testing: SQLite in-memory (StaticPool).

3. Catalog-service
   - Catálogo de alimentos: crear, consultar, listar y filtrar.

4. Tracker-service
   - Registro diario: comidas, ejercicios y actividades.

5. Goals-service
   - Objetivos de nutrición: upsert automático y getter.

6. Stats-service
   - Consume Tracker y Goals para cálculo de estadísticas, promedios y progreso.
   - Mocking HTTP con respx para dependencias externas.

## ✅ Sistema de logs
- Logger por microservicio con nombre único.  
- Middleware que registra método, URL, estado y excepciones.  
- Salida configurable a archivo o stdout con formato uniforme.


- [log](../screenshots/log.png)

Cada vez que se hace una llamada aparece el log por consola de la acción realizada también si salta alguna excepción.

Ejemplo de middleware:
```python
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response
```

## ✅ Tests funcionando correctamente
- Pruebas funcionales de API y unitarias de lógica.  
- Mocking de microservicios externos (respx).  
- Inyección de base de datos temporal (SQLite in-memory).  
- Cobertura de rutas CRUD y validaciones.  
- Ejecución local: make test-all (todos los tests pasan).

## ✅ Ejecución automatizada en GitHub Actions
Workflow: .github/workflows/test.yml  
Cada servicio corre en un job independiente:
- auth-service, user-service, goals-service, catalog-service, tracker-service, stats-service  
Todos deben pasar para aprobar el commit/PR.

- [Ejecucion de test Github Actions](../screenshots/CI-microservices.png)

## ✅ Makefile integrado
Targets disponibles:
- make test-user
- make test-auth
- make test-goals
- make test-catalog
- make test-tracker
- make test-stats
- make test-all

Permite estandarizar y reutilizar lógica en CI.

## ✅ Conclusión
Hito completo: APIs REST desacopladas, lógica separada por capas, tests por servicio, logs integrados, CI automatizado y Makefile funcional. El backend está listo para escalar y continuar con próximos hitos.