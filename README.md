# 🌿 Invitación de Boda - Agustín & Eliana

Este repositorio contiene el código fuente de la invitación web para el casamiento de Agustín y Eliana (06/03/2027). La página está diseñada con un estilo Boho, moderno y minimalista, e incluye un sistema de confirmación de asistencia (RSVP) conectado directamente a un Google Sheet.

## 📊 Base de Datos (Google Sheets)
Todas las respuestas de los invitados se guardan automáticamente en este Excel.
👉 **[Abrir Google Sheets de Confirmaciones](https://docs.google.com/spreadsheets/d/12LPwu0b-StGkWlkkgMBpfqFU8YZVyRN8qUvFF1CA9Co/edit?gid=0#gid=0)**

### ¿Cómo funciona la integración?
1. Cuando un invitado completa el formulario, la web envía los datos a una URL de **Google Apps Script**.
2. El script (`doPost`) recibe los datos en formato JSON, calcula la fecha actual de Argentina, y añade una nueva fila al Excel (`appendRow`).
3. El código de Google Apps Script incluye una lógica (usando `insertCheckboxes()`) para que, al agregar la nueva fila, se inserte automáticamente una **casilla de verificación** en la columna "Pagado" (Columna J).

*URL del script que recibe los datos (POST):* `https://script.google.com/macros/s/AKfycbxprt3uP2Psq6DfIo0K9gdoiqQW33SD4CeFLqvnqkLkjKsWGoI7MUPpUpfw6mjrGdw/exec`

## ✨ Características y Flujo de la Invitación
* **Animaciones Escalonadas:** Efectos visuales de tipo cascada utilizando clases como `delay-100` y `delay-200` junto con un `IntersectionObserver` que detecta cuando el usuario hace scroll.
* **Agenda Integrada:** Botón directo para agendar la fecha en Google Calendar.
* **Calculadora de Costos:** Calcula internamente el costo de la tarjeta según la cantidad de invitados:
  * Tarjeta Mayor: `$35.000` (Variable `PRICE_ADULT` modificable en `main.js`)
  * Tarjeta Menor: `$15.000` (Variable `PRICE_CHILD` modificable en `main.js`)
* **Flujo de Pagos (UX):** La sección con los datos bancarios y el alias está **oculta por defecto**. Recién cuando el usuario confirma su asistencia y le da a enviar, la página suelta confetti 🎉, revela el panel de transferencia con el total exacto a pagar, y desliza la pantalla hacia esa sección suavemente.

## 🛠️ Tecnologías utilizadas
* **Frontend**: HTML5, Vanilla JavaScript.
* **Estilos**: Tailwind CSS (configurado para usar fuentes de Google Fonts como *Lato* y *Vidaloka*).
* **Efectos Extra**: Librería `canvas-confetti` (importada por CDN).
* **Build Tool**: Vite.

## 🚀 Entorno de Desarrollo Local
Para levantar el proyecto en tu computadora y hacer modificaciones:

1. Instalar las dependencias (el proyecto usa `pnpm`, pero puedes usar `npm` o `yarn`):
```bash
pnpm install
```

2. Levantar el servidor de desarrollo (suele abrirse en `localhost:5173` o el puerto que asigne Vite):
```bash
pnpm run dev
```

3. Para compilar la versión final para subir al hosting (generará una carpeta `/dist`):
```bash
pnpm run build
```
