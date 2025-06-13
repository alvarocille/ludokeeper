# 🎲 LudoKeeper – Gestor de Juegos de Mesa

**LudoKeeper** es una aplicación multiplataforma desarrollada con arquitectura de microservicios. Permite a los usuarios gestionar su inventario personal de juegos de mesa, registrar partidas, explorar un catálogo público y más. 

Este repositorio actúa como **punto central de orquestación** de todos los microservicios y del frontend, con una configuración completa en Docker y scripts automatizados para el despliegue. En cada directorio encontrarás más información.

---

## 🚀 Tecnologías principales

- **Frontend multiplataforma**: React Native (Expo)
- **Backend**: Node.js (Fastify / Express) + MongoDB
- **Autenticación**: Keycloak (con roles)
- **Infraestructura**: Docker, Docker Compose
- **Pruebas**: Vitest, MongoMemoryServer
- **Documentación de API**: Swagger (Zod + zod-to-json-schema)

---

## 📁 Estructura del proyecto

```bash
.
├── backend
│   ├── IAM/              # Servicio de autenticación (con proxy a Keycloak)
│   ├── inventory/        # Gestión del inventario de juegos del usuario
│   ├── catalog/          # Catálogo global de juegos (fuente pública o manual)
│   └── match/            # Registro y gestión de partidas
├── keycloak/             # Configuración y realm para Keycloak
├── frontend/
│   └── ludokeeper/       # App móvil Expo
├── public_key.pem        # Clave pública JWT compartida
├── run.ps1               # Script para iniciar el proyecto (Windows)
├── run.sh                # Script para iniciar el proyecto (Linux/macOS)
└── README.md             # Este archivo
```
---

## Memoria del Proyecto
Para obtener una descripción completa del análisis, diseño, implementación, pruebas y despliegue del proyecto, puedes consultar la memoria del proyecto en formato PDF, la cual se encuentra en este repositorio:

[Memoria del Proyecto (PDF)](https://github.com/alvarocille/ludokeeper/blob/main/Cilleruelo_Sinovas_Alvaro_Memoria_ProyectoFinal_DAM25.pdf)
