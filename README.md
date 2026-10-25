<div align="center">

<img src="src/assets/valkora-basket.webp" alt="Cesta de productos de Valkora" width="320">

# 👑 VALKORA · SUPERMERCADOS

### Desarrollo Frontend II · PFY2202 · Semana 1 · Evaluación Formativa 1

**Supermercado ficticio con React, React Router y un inventario interactivo de demostración.**

*Calidad que nos distingue.*

</div>

---

## ✦ Visión general

**Valkora** es una aplicación de supermercado creada para demostrar la navegación entre distintas pantallas mediante **React Router** y un **menú inferior**. Además del contenido requerido, su portada incluye un inventario de productos y un carrito lateral con una **compra simulada** que actualiza las existencias de forma local.

El proyecto utiliza una identidad visual *Royal Iridescence*: ciruela, burdeo, marfil, dorado y reflejos nacarados. **Todos los datos son ficticios**; el sitio no realiza ventas ni pagos reales.

| 🏠 Inicio | 🏬 Nuestras tiendas | ❔ Preguntas frecuentes | 🛒 Carrito lateral |
|:---:|:---:|:---:|:---:|
| Inventario y métricas | 3 sucursales ficticias | Información del sitio | Compra simulada |

### Funcionalidades de esta versión

- ⚛️ Aplicación React + Vite con **tres rutas** y menú inferior activo.
- 📦 Catálogo de **6 productos de demostración** y estados dinámicos de existencias.
- ☑️ Selección individual o de todos los productos disponibles.
- 🛒 Carrito **offcanvas a la derecha**, abierto desde un botón flotante con contador.
- ➕➖ Control de cantidades, eliminación de productos y vaciado del carrito.
- ✅ Confirmación de compra **simulada**, con descuento de unidades del inventario.
- 🔁 Actualización automática del resumen y de las etiquetas de stock.
- 💾 Persistencia local de inventario y carrito mediante `localStorage`.
- ↩️ Restablecimiento del inventario inicial con confirmación.
- ✨ Diseño tornasolado adaptable a escritorio y móvil, con soporte para movimiento reducido.

---

## 🧭 Navegación con React Router

| Pantalla | Ruta | Contenido |
|---|---|---|
| 🏠 Inicio | `/` | Presentación, indicadores, inventario y carrito |
| 🏬 Nuestras tiendas | `/tiendas` | Valkora Norte, Centro y Costa |
| ❔ Preguntas frecuentes | `/preguntas-frecuentes` | Consultas frecuentes sobre esta demostración |

`BrowserRouter` envuelve la aplicación en `src/main.jsx`, `App.jsx` define las rutas y `BottomNav.jsx` utiliza `NavLink` para identificar la pantalla activa. La navegación se realiza sin recargar el documento completo.

---

## 📦 Inventario y estados

Los productos base se declaran en `src/data/products.js`:

| Producto | Categoría | Stock inicial |
|---|---|---:|
| Arroz 1 kg | Abarrotes | 30 |
| Leche 1 L | Lácteos | 5 |
| Aceite 900 ml | Abarrotes | 0 |
| Manzanas 1 kg | Frutas y verduras | 18 |
| Pan de molde | Panadería | 8 |
| Huevos (12 unidades) | Huevos | 23 |

| Estado | Condición |
|---|---|
| **Disponible** | Más de 8 unidades |
| **Stock bajo** | Entre 1 y 8 unidades |
| **Agotado** | 0 unidades |

El umbral de **stock bajo** se centraliza mediante `LOW_STOCK_THRESHOLD`, para que las etiquetas y el contador del resumen utilicen la misma regla.

### Flujo del carrito y la compra simulada

```text
Productos disponibles (products.js)
                 ↓
     Selección desde Home.jsx
                 ↓
       useValkoraShop.js
                 ↓
   Carrito lateral (CartPanel.jsx)
                 ↓
  Ajustar cantidades / quitar / vaciar
                 ↓
        Confirmar compra simulada
                 ↓
   Validar cantidades disponibles
                 ↓
  Descontar stock + vaciar carrito
                 ↓
  Recalcular indicadores y estados
                 ↓
 Guardar estado local (localStorage)
```

Un producto agotado no se puede añadir al carrito; el botón `+` se deshabilita al alcanzar las unidades disponibles. **Seleccionar** un producto no descuenta existencias: el descuento se realiza al **confirmar la compra simulada**.

### 🛒 Carrito lateral

El carrito se abre desde un botón flotante y entra suavemente por el **costado derecho**. Se puede cerrar usando **×**, haciendo clic en el fondo oscurecido o presionando **Escape**. Mientras está abierto se bloquea el desplazamiento de la página de fondo y se controla el foco del teclado.

Se adapta a pantallas pequeñas y respeta la preferencia del sistema `prefers-reduced-motion`.

---

## 💾 Persistencia de demostración

El hook `useValkoraShop.js` almacena el estado local bajo la clave:

```text
valkora:supermercado:demo:v1
```

Guarda **cantidades de inventario y carrito**, no un historial comercial. Al restaurar los datos, valida los identificadores y las cantidades para evitar valores fuera de los límites del catálogo.

**Restablecer inventario demo** recupera las cantidades originales y vacía el carrito. La información queda únicamente en el navegador utilizado; no existe una base de datos ni sincronización entre dispositivos o usuarios.

---

## ⚛️ Arquitectura React

| Archivo | Responsabilidad |
|---|---|
| `src/App.jsx` | Estructura general y rutas |
| `src/components/BottomNav.jsx` | Menú inferior con enlaces activos |
| `src/components/BrandMark.jsx` | Emblema vectorial de Valkora |
| `src/components/MetricIcon.jsx` | Íconos de las tarjetas de inventario |
| `src/components/CartPanel.jsx` | Interfaz del carrito lateral y accesibilidad del panel |
| `src/hooks/useValkoraShop.js` | Estado, persistencia, validaciones y compra simulada |
| `src/data/products.js` | Catálogo base y regla de estado de stock |
| `src/pages/Home.jsx` | Portada, métricas y selección de productos |
| `src/pages/Stores.jsx` | Tres sucursales de demostración |
| `src/pages/FAQ.jsx` | Preguntas frecuentes |
| `src/styles/index.css` | Estilos y adaptaciones responsive |

### Hooks y eventos principales

| Recurso | Uso |
|---|---|
| `useState` | Estado del carrito, inventario y apertura del panel |
| `useEffect` | Persistencia y gestión de eventos del panel lateral |
| `useRef` | Control y restauración del foco del carrito |
| `useCallback` | Referencia estable al cierre del panel |
| `onClick` | Carrito, cantidades, compra y restablecimiento |
| `onChange` | Selección de productos |
| `localStorage` | Persistencia únicamente local |

---

## 🗂️ Estructura del proyecto

<details>
<summary><strong>Ver estructura de archivos</strong></summary>

```text
Valkora_Supermercado/
├── .gitignore
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── assets/
    │   └── valkora-basket.webp
    ├── components/
    │   ├── BottomNav.jsx
    │   ├── BrandMark.jsx
    │   ├── CartPanel.jsx
    │   └── MetricIcon.jsx
    ├── data/
    │   └── products.js
    ├── hooks/
    │   └── useValkoraShop.js
    ├── pages/
    │   ├── Home.jsx
    │   ├── Stores.jsx
    │   └── FAQ.jsx
    └── styles/
        └── index.css
```

</details>

---

## ✨ Identidad visual y adaptabilidad

- **Ciruela y burdeo:** encabezado, portada y navegación inferior.
- **Marfil:** fondos y superficies de lectura.
- **Dorado:** logotipo, botones, bordes y detalles.
- **Tornasol nacarado:** acentos lavanda, rosa perlado y reflejos suaves.
- **Brillos animados:** detalles decorativos que se desactivan cuando se prefiere movimiento reducido.

La tabla de inventario mantiene desplazamiento horizontal **dentro de su contenedor** cuando el ancho de pantalla es reducido; el carrito lateral se ajusta al espacio disponible.

---

## 🚀 Instalación y ejecución

**Requisito:** Node.js compatible con Vite 7 (Node **20.19+** o **22.12+**) y npm.

Desde la raíz del proyecto:

```bash
npm ci
npm run dev
```

Abrir la URL mostrada en la terminal (habitualmente `http://localhost:5173/`).

### Compilación de producción

```bash
npm run build
npm run preview
```

> `node_modules/` y `dist/` no se incluyen en el repositorio: se generan al instalar dependencias y compilar.

---

## ✅ QA y verificación previa a la entrega

| Comprobación | Resultado esperado |
|---|---|
| Las tres páginas abren correctamente | ✅ |
| El menú inferior identifica la vista activa | ✅ |
| El carrito aparece como panel lateral derecho | ✅ |
| Se pueden sumar, restar y eliminar productos | ✅ |
| No se permite superar el stock disponible | ✅ |
| Confirmar compra descuenta existencias | ✅ |
| El inventario y el carrito persisten al recargar | ✅ |
| Restablecer recupera las cantidades iniciales | ✅ |
| La compilación de producción termina sin errores | ✅ |

Los indicadores representan comprobaciones de funcionamiento del proyecto; **no se declara una suite de pruebas automatizadas incluida**, porque esta versión no la incorpora.

---

## 🧰 Tecnologías

<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7">
<img src="https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router 7">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">

</div>

---

## 📁 Entrega académica

La actividad formativa solicita disponibilizar el código fuente en un repositorio GitHub con el nombre:

```text
supermercado-natalia-alvarado-PFY2202
```

Tras publicar, **compartir la URL del repositorio con el docente**. No se requiere backend, servidor de pagos ni despliegue web para cumplir el enunciado entregado.

> **Si en el futuro se publica en GitHub Pages:** el sitio utiliza `BrowserRouter`; las rutas directas como `/tiendas` necesitarán una estrategia de fallback/redirección en ese alojamiento. Esto no afecta la entrega del repositorio de código.

---

<div align="center">

### 👑 Valkora · Supermercados

**Desarrollo Frontend II · PFY2202 · Semana 1**

Natalia Alvarado · 2026

*Calidad que nos distingue.*

</div>
