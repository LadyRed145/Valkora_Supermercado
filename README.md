<div align="center">

<img src="Semana%201/src/assets/valkora-basket.webp" alt="Cesta de productos de Valkora" width="360">

# 👑 VALKORA · SUPERMERCADOS

### Desarrollo Frontend II · PFY2202 · Semana 1

**Supermercado ficticio desarrollado con React, React Router, JavaScript, HTML y CSS.**

*Calidad que nos distingue.*

[📁 Repositorio Valkora](https://github.com/LadyRed145/Valkora_Supermercado)

</div>

---

## ✦ Visión general

**Valkora** es una aplicación de supermercado con tres pantallas conectadas mediante **React Router** y un menú inferior. Su página principal presenta un inventario de demostración y permite seleccionar artículos, administrarlos desde un carrito lateral y confirmar compras simuladas que descuentan unidades del stock.

El diseño utiliza la identidad visual **Royal Iridescence**, con tonos ciruela, burdeo, marfil, dorado y reflejos nacarados. Los productos, las sucursales y sus datos son ficticios. **No se procesan pagos ni pedidos reales.**

| 🏠 Inicio | 🏬 Nuestras tiendas | ❔ Preguntas frecuentes | 🛒 Mi carrito |
|:---:|:---:|:---:|:---:|
| Inventario y métricas | 3 sucursales ficticias | 4 respuestas informativas | Panel lateral deslizante |

### Funcionalidades implementadas

- ⚛️ Tres rutas con **React Router** y menú inferior que identifica la pantalla activa.
- 📦 Inventario inicial de **6 productos**, con unidades disponibles y estados de stock derivados de las existencias.
- ☑️ Selección individual y selección conjunta de productos disponibles.
- 🛒 Carrito lateral derecho con botón flotante y contador de unidades.
- ➕➖ Aumento y disminución de cantidades, eliminación de artículos y vaciado del carrito.
- ✅ **Compra simulada** con validación de cantidades y descuento de existencias.
- 🔁 Actualización de indicadores y etiquetas del inventario después de la compra.
- 💾 Conservación local del inventario y del carrito mediante `localStorage`.
- ↩️ Restablecimiento del inventario original con confirmación.
- ✨ Efectos dorados y tornasolados, estilos adaptables y soporte para movimiento reducido.

---

## 🧭 Navegación

| Página | Ruta | Contenido |
|---|---|---|
| 🏠 Inicio | `/` | Portada, indicadores, inventario y acceso al carrito |
| 🏬 Nuestras tiendas | `/tiendas` | Valkora Norte, Valkora Centro y Valkora Costa |
| ❔ Preguntas frecuentes | `/preguntas-frecuentes` | Inventario, sucursales, stock y compra simulada |

La navegación utiliza `BrowserRouter` en `main.jsx`, `Routes` y `Route` en `App.jsx`, y `NavLink` en `BottomNav.jsx`. La cabecera y el menú permanecen visibles mientras cambia el contenido de la página.

---

## 📦 Inventario de productos

Los datos iniciales están definidos en `products.js`.

| Producto | Categoría | Stock inicial |
|---|---|---:|
| Arroz 1 kg | Abarrotes | 30 |
| Leche 1 L | Lácteos | 5 |
| Aceite 900 ml | Abarrotes | 0 |
| Manzanas 1 kg | Frutas y verduras | 18 |
| Pan de molde | Panadería | 8 |
| Huevos (12 unidades) | Huevos | 23 |

El estado de cada producto se calcula mediante `getStockStatus()` y el umbral `LOW_STOCK_THRESHOLD`:

| Estado | Existencias |
|---|---|
| **Disponible** | Más de 8 unidades |
| **Stock bajo** | Entre 1 y 8 unidades |
| **Agotado** | 0 unidades |

Las tarjetas de **Total de productos**, **Con existencias** y **Stock bajo** se calculan a partir del inventario actual, no de cifras fijas. Un producto agotado no puede agregarse al carrito.

---

## 🛒 Carrito lateral y compra simulada

El botón flotante **Mi carrito** abre un panel desde el lado derecho. El panel muestra los productos seleccionados, las unidades de cada uno, los totales de artículos diferentes y unidades, y las acciones disponibles.

Permite:

- Agregar productos desde la tabla de inventario.
- Aumentar o disminuir cantidades sin superar las existencias actuales.
- Quitar un artículo o vaciar el carrito completo.
- Confirmar una compra simulada y descontar sus unidades del inventario.
- Cerrar el panel con **×**, con un clic fuera de él o con la tecla **Escape**.

Mientras el panel está abierto, se bloquea el desplazamiento de la página de fondo y se gestiona el foco para la navegación con teclado.

### Flujo funcional

```text
Inventario inicial (products.js)
             ↓
   Selección en Home.jsx
             ↓
    useValkoraShop.js
             ↓
  Carrito lateral (CartPanel.jsx)
             ↓
   Ajustar o quitar unidades
             ↓
    Confirmar compra simulada
             ↓
   Validar stock disponible
             ↓
  Descontar unidades y vaciar carrito
             ↓
  Recalcular estados e indicadores
             ↓
   Persistir datos en localStorage
```

**Seleccionar un producto no modifica el stock.** Las unidades solo se descuentan cuando se confirma la compra simulada. No se calculan precios ni se realizan cobros.

---

## 💾 Persistencia local

El estado se administra en el hook `useValkoraShop.js` y se conserva bajo la clave:

```text
valkora:supermercado:demo:v1
```

Se almacenan las cantidades actuales del inventario y las cantidades del carrito. Al recuperar información guardada, el código valida los identificadores y limita las cantidades a los valores aceptados por el catálogo.

El botón **Restablecer inventario demo** pide confirmación y recupera las cantidades iniciales, dejando el carrito vacío. La información permanece en el navegador utilizado: no hay base de datos, backend, pagos ni sincronización entre usuarios o dispositivos.

---

## ⚛️ Arquitectura React

| Archivo | Responsabilidad |
|---|---|
| `App.jsx` | Estructura compartida, rutas y redirección de rutas desconocidas |
| `main.jsx` | Montaje de React y configuración de `BrowserRouter` |
| `components/BottomNav.jsx` | Menú inferior y enlaces activos |
| `components/BrandMark.jsx` | Emblema SVG de la marca |
| `components/MetricIcon.jsx` | Iconografía del resumen de inventario |
| `components/CartPanel.jsx` | Carrito lateral, controles y gestión del foco |
| `hooks/useValkoraShop.js` | Estado del carrito, validaciones, persistencia y compra simulada |
| `data/products.js` | Datos iniciales y función para clasificar el stock |
| `pages/Home.jsx` | Portada, indicadores y selección de productos |
| `pages/Stores.jsx` | Información de las tres sucursales |
| `pages/FAQ.jsx` | Cuatro preguntas frecuentes |
| `styles/index.css` | Estilos generales, efectos visuales y adaptación de pantallas |

### Hooks y mecanismos utilizados

| Recurso | Uso en Valkora |
|---|---|
| `useState` | Estado de la tienda y apertura del carrito |
| `useEffect` | Persistencia y eventos del panel lateral |
| `useRef` | Foco del carrito y restauración del foco anterior |
| `useCallback` | Función estable de cierre del carrito |
| `onClick` | Acciones del carrito y restablecimiento |
| `onChange` | Casillas de selección de productos |
| `createPortal` | Renderizado del carrito fuera del árbol visual principal |
| `localStorage` | Persistencia local de inventario y carrito |

---

## 🗂️ Estructura publicada en GitHub

<details>
<summary><strong>Ver archivos del repositorio</strong></summary>

```text
Valkora_Supermercado/
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── Semana 1/
    └── src/
        ├── App.jsx
        ├── main.jsx
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

## ✨ Identidad visual

La estética **Royal Iridescence** combina un encabezado y un menú inferior en ciruela y burdeo, superficies marfil, detalles dorados y reflejos perlados. Incluye un emblema SVG, una imagen decorativa de una cesta con productos, destellos animados y acabados cromáticos en secciones y tarjetas.

La interfaz contempla pantallas pequeñas: la tabla permite desplazamiento horizontal dentro de su contenedor y el carrito lateral adapta su ancho. Las reglas CSS de `prefers-reduced-motion` reducen las transiciones y animaciones cuando el sistema así lo solicita.

---

## 🧰 Tecnologías utilizadas

<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7">
<img src="https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router 7">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">

</div>

---

<div align="center">

### 👑 Valkora · Supermercados

**Desarrollo Frontend II · PFY2202 · Semana 1**

Natalia Alvarado · 2026

*Calidad que nos distingue.*

</div>
