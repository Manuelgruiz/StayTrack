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
- [Ejecucion de test locales](../screenshots/CI-Github.png)
