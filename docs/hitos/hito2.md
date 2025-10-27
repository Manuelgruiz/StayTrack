# Hito 2 – Integración Continua (CI)

**Alumno:** Manuel García Ruiz  
**Email:** manuelgruiz22@gmail.com  
**Proyecto:** StayTrack  

---

## 🎯 Objetivo

El objetivo de este hito es implementar un sistema de **Integración Continua (CI)** que permita ejecutar automáticamente los tests del proyecto StayTrack al realizar *push* o *pull request* en el repositorio.  
Este proceso garantiza la **calidad del código**, la **estabilidad de la aplicación** y la **automatización del flujo de desarrollo**.

---

## 🧰 Tecnologías y dependencias utilizadas

| Tipo | Herramienta / Librería | Versión | Propósito |
|------|------------------------|----------|------------|
| **Framework web** | FastAPI | 0.118.0 | Creación de la API REST principal |
| **Servidor ASGI** | Uvicorn | 0.37.0 | Ejecución del backend |
| **ORM** | SQLAlchemy | 2.0.36 | Gestión de modelos y consultas a base de datos |
| **Validación** | Pydantic | 2.11.10 | Validación de datos y serialización |
| **Gestión de entorno** | python-dotenv | 1.0.1 | Carga de variables desde `.env` |
| **Cliente HTTP para tests** | HTTPX | 0.27.0 | Simulación de peticiones en tests |
| **Framework de testing** | Pytest | 8.4.2 | Descubrimiento y ejecución de tests |
| **Biblioteca de aserciones** | `assert` (Python) | nativa | Validación de resultados |
| **Base de datos de pruebas** | SQLite | — | Base de datos ligera para testing |
| **Gestor de tareas** | Makefile | — | Estandariza la ejecución de tests |
| **CI/CD** | GitHub Actions | — | Automatiza los tests en cada commit o PR |

---

## ⚙️ 1️⃣ (1.5 puntos) Elección y configuración del **gestor de tareas**

Se ha elegido **Makefile** como gestor de tareas principal del proyecto.



## 🧪 2️⃣ (1.5 puntos) Elección y uso de la **biblioteca de aserciones**

Se ha utilizado la **biblioteca de aserciones nativa de Python**, mediante la palabra clave `assert`.  
Esta elección es apropiada para proyectos basados en **pytest**, ya que permite una sintaxis clara, legible y sin dependencias externas.



## 🧱 3️⃣ (1.5 puntos) Elección y uso del **marco de pruebas**

El marco de pruebas elegido es **Pytest**, debido a su facilidad de uso, amplia documentación y compatibilidad con **FastAPI**.

## 🔄 4️⃣ (4 puntos) **Integración continua funcionando** y justificación del sistema elegido

El sistema de **Integración Continua (CI)** elegido es **GitHub Actions**, por su integración nativa con **GitHub**, facilidad de configuración y capacidad para ejecutar flujos automatizados en la nube.

## 🧩 5️⃣ (1.5 puntos) Correcta implementación y ejecución de los **tests** para testear la lógica de negocio

Se han implementado y ejecutado correctamente los **tests unitarios** para validar aspectos clave de la lógica de negocio de la aplicación **StayTrack**.  
Estos tests verifican el correcto funcionamiento de los endpoints, las respuestas del servidor y la gestión de datos del modelo principal.

### 🧪 Ejemplo de ejecución local de los tests:
- [Ejecucion de test locales](../screenshots/test.png)

### ⚙️ Ejecución automática en GitHub Actions:
- [Ejecucion del Github Actions](../screenshots/CI-Github.png)


### Implementación de test:

1. test_read_root()
👉 Qué hace:
Comprueba que la ruta principal (/) responda bien.
🔍 Espera:

Código 200.
JSON con {"message": "Welcome to StayTrack!"}.
✅ Significa:
El servidor está funcionando y responde correctamente en la raíz.
2. test_health_check()
👉 Qué hace:
Verifica que la ruta /health indique que todo está bien.
🔍 Espera:

Código 200.
JSON con {"status": "ok"}.
✅ Significa:
La API puede confirmar que está activa.
3. test_create_user()
👉 Qué hace:
Envía datos de un usuario nuevo al endpoint /users/.
🔍 Espera:

Código 200.
Que devuelva los datos del usuario creado y un campo id.
✅ Significa:
La creación de usuarios funciona correctamente.
4. test_list_users()
👉 Qué hace:
Solicita la lista de todos los usuarios en /users/.
🔍 Espera:

Código 200.
Una lista JSON con al menos un usuario.
✅ Significa:
El endpoint para listar usuarios funciona bien.
5. test_add_food()
👉 Qué hace:
Primero crea un usuario y luego agrega un alimento con /users/{id}/foods/.
🔍 Espera:

Código 200.
JSON con los datos del alimento (nombre, calorías, etc.).
✅ Significa:
Se pueden registrar alimentos para un usuario.
6. test_add_exercise()
👉 Qué hace:
Crea un usuario y agrega un ejercicio con /users/{id}/exercises/.
🔍 Espera:

Código 200.
JSON con los datos del ejercicio (nombre, duración, calorías, etc.).
✅ Significa:
Se pueden registrar ejercicios para un usuario.
🧠 En resumen
Estos tests comprueban que:
La API responde correctamente.
Se pueden crear usuarios.
Se pueden listar usuarios.
Se pueden agregar alimentos y ejercicios a cada usuario.
Son pruebas básicas pero muy útiles para asegurar que la aplicación funciona como debe.
