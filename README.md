# ✨ To-Do

Una aplicación de gestión de tareas estilo Kanban, desarrollada con HTML, CSS y JavaScript puro. Sin frameworks, sin dependencias — todo corre directo en el navegador.

🔗 **Demo en vivo:** [to-do-palmieri.netlify.app](https://to-do-palmieri.netlify.app/)

---

## 📸 Vista general

La app organiza tus tareas en tres columnas:

| 📝 Por Empezar | ⚡ En Progreso | ✅ Finalizadas |
|---|---|---|
| Tareas pendientes | Tareas en curso | Tareas completadas |

**Modo claro**
<img width="1619" height="925" alt="image" src="https://github.com/user-attachments/assets/7a1968b3-f5c4-4abe-be56-1602bcbc4f2b" />

**Modo oscuro**
<img width="1646" height="932" alt="image" src="https://github.com/user-attachments/assets/57e3af63-f932-4f58-871a-fd486d743da7" />

---

## 🚀 Funcionalidades

### Tableros
- **Múltiples tableros**: podés crear tantos tableros como necesites (trabajo, personal, proyectos, etc.)
- **Color por tablero**: cada tablero tiene un color identificador (azul, rojo, verde, amarillo, púrpura)
- **Editar tablero**: renombrarlo o cambiarle el color en cualquier momento
- **Eliminar tablero**: con confirmación para evitar borrados accidentales
- **Exportar tablero**: descarga el tablero como archivo `.json` para respaldo

### Tareas
- **Agregar tareas** con nombre, prioridad, fecha de vencimiento y etiquetas (tags)
- **Tres niveles de prioridad**: Alta, Media y Baja — con badge de color en cada tarea
- **Fecha de vencimiento**: muestra la fecha y marca en rojo si está vencida
- **Tags personalizados**: podés agregar múltiples etiquetas separadas por coma
- **Editar tarea**: doble clic sobre cualquier tarea para modificarla
- **Eliminar tarea**: botón 🗑️ con confirmación
- **Drag & Drop**: arrastrá las tareas entre columnas para cambiar su estado

### Búsqueda y Filtros
- **Búsqueda en tiempo real** por texto de la tarea
- **Filtro por prioridad**: mostrar solo tareas de alta, media o baja prioridad
- **Filtro por tag**: hacé clic en un tag para filtrar por esa etiqueta
- **Limpiar filtros**: resetea todos los filtros con un clic

### UI / UX
- **Modo oscuro** con toggle, se recuerda entre sesiones
- **Estadísticas en tiempo real**: contador de tareas por columna y total
- **Persistencia automática**: todo se guarda en `localStorage`, no perdés nada al cerrar el navegador
- **Atajos de teclado**: presioná Enter para agregar una tarea o un tablero nuevo

---

## 🗂️ Estructura del proyecto

```
to-do/
├── index.html       # Estructura principal de la app
├── styles.css       # Estilos, modo oscuro y diseño responsive
├── script.js        # Lógica de la aplicación (tableros, tareas, drag & drop, filtros)
└── asset/
    └── favicon.png  # Ícono de la página
```

---

## 🛠️ Tecnologías

- **HTML5** — estructura semántica
- **CSS3** — estilos, variables, animaciones y modo oscuro
- **JavaScript (ES6+)** — lógica, DOM, drag & drop API y localStorage
- **Netlify** — deploy estático

---

## 💾 Almacenamiento

La app usa `localStorage` del navegador para guardar todos los datos. No requiere servidor ni base de datos. Los datos persisten entre sesiones mientras uses el mismo navegador.

---

## ▶️ Cómo usarla localmente

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/to-do.git
   ```
2. Abrí `index.html` en tu navegador.

No necesita instalación ni servidor. Funciona directo al abrir el archivo.

---

## 📄 Licencia

Este proyecto es de uso libre. Podés modificarlo y adaptarlo como quieras.
