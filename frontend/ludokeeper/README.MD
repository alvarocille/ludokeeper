# 🎮 Ludokeeper – Frontend

Este es el cliente multiplataforma oficial de **Ludokeeper**, una aplicación multiplataforma para la gestión de juegos de mesa. Construido con **React Native** usando **Expo**, este frontend se conecta a los microservicios del backend para permitir a los usuarios gestionar su inventario de juegos, partidas y mucho más.

---

## ✨ Características actuales

- 🔐 Autenticación con Keycloak y renovación de tokens con `/auth/refresh`
- 🧾 Gestión de inventario con filtros, búsqueda, edición y eliminación
- 📚 Consulta e importación desde el catálogo público de juegos
- 📅 Gestión de partidas (creación, edición y borrado) — *en progreso*
- 🎨 Interfaz visual adaptable con soporte para tema claro y oscuro
- 🧰 Componentes reutilizables para formularios, inputs, botones, modales y más
- 🎲 Simulador de dados con animaciones y soporte gráfico para D6
- ⏱ Temporizador configurable con notificación por vibración
- 📱 Navegación estructurada con `expo-router`, `Tabs`, `Drawer` y pantallas dinámicas

---

## 🧱 Tecnologías utilizadas

- **React Native** + **Expo**
- **expo-router** para navegación basada en archivos
- **Zustand** para manejo de estado global
- **Axios** para comunicación con los microservicios
- **react-hook-form + yup** para validación de formularios
- **NativeWind** para estilos tipo Tailwind CSS
- **Ionicons** y SVGs personalizados para iconografía

---

## 📁 Estructura principal

```bash
src/
├── api/                 # Servicios para conectarse a los microservicios
│   ├── auth.ts
│   ├── catalog.ts
│   ├── inventory.ts
│   └── match.ts
├── components/
│   ├── form/            # Inputs, selects, formularios reutilizables
│   ├── games/           # GameCard, barra de búsqueda y filtros
│   └── layouts/         # Modales: detalles, formularios, etc.
├── config/              # URLs de APIs
├── constants/           # Íconos, navegación...
├── hooks/               # useInventory, useAuthForm, useMatch...
├── store/               # authStore, themeStore (Zustand)
├── styles/              # Estilos globales, colores, tipografías
├── utils/               # Funciones auxiliares como getGameInfo
├── validations/         # Validaciones con Yup
├── types/               # Tipado global
└── app/                 # Rutas de la app con expo-router
    ├── (auth)/          # Login y registro
    ├── (root)/          # Pantallas principales: inventario, catálogo, menú
    ├── (tools)/         # Herramientas: dados, temporizador, cronómetro
    └── (other)/         # Ajustes, acerca de
```

---

## 🚀 Instalación y uso local (para uso especifico del microservicio)
### 1. Asegúrate de tener Node.js, Expo CLI y un emulador o dispositivo físico:
``` bash
npm install -g expo-cli
```
### 2. Clona el repositorio completo
``` bash
git clone https://github.com/alvarocille/ludokeeper.git
cd ludokeeper/frontend
```
### 3. Instala las dependencias
``` bash
npm install
```
### 4. Ejecuta la aplicación
``` bash
npx expo start
```
---

## 📄 Licencia

MIT © Álvaro Cilleruelo Sinovas
