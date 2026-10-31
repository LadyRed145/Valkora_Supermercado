import { createContext, createElement, useContext, useEffect, useState } from 'react';
import { products } from '../data/products.js';

// React Context comparte inventario y carrito entre todas las páginas.
// Se mantiene una migración de la clave de Semana 1 para conservar datos existentes.
const ShopContext = createContext(null);
const STORAGE_KEY = 'valkora:supermercado:demo:v2';
const LEGACY_STORAGE_KEY = 'valkora:supermercado:demo:v1';
const INITIAL_IDS = new Set(products.map(({ id }) => id));
const MAX_STOCK = 100000;
const MAX_ITEMS = 500;
const validStock = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_STOCK;
const cleanText = (value, maxLength = 80) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : '';
const initialShop = () => ({ items: products.map((item) => ({ ...item })), cartById: {}, notice: '' });

function restoreCart(savedCart, items) {
  const cartById = {};
  if (!savedCart || typeof savedCart !== 'object' || Array.isArray(savedCart)) return cartById;
  for (const item of items) {
    const quantity = savedCart[item.id];
    if (Number.isInteger(quantity) && quantity > 0 && quantity <= item.stock) {
      cartById[item.id] = quantity;
    }
  }
  return cartById;
}

function loadShop() {
  const initial = initialShop();
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved?.version === 2 && Array.isArray(saved.items)) {
      const seen = new Set(INITIAL_IDS);
      const restoredBasics = new Map(saved.items.filter((item) => item && INITIAL_IDS.has(item.id)).map((item) => [item.id, item]));
      const items = products.map((item) => {
        const stock = restoredBasics.get(item.id)?.stock;
        return { ...item, stock: validStock(stock) && stock <= item.stock ? stock : item.stock };
      });
      for (const item of saved.items) {
        if (items.length >= MAX_ITEMS) break;
        if (!item || !Number.isSafeInteger(item.id) || item.id <= 0 || seen.has(item.id)) continue;
        const name = cleanText(item.name);
        const brand = cleanText(item.brand);
        const type = cleanText(item.type);
        if (!name || !brand || !type || !validStock(item.stock)) continue;
        seen.add(item.id);
        items.push({ id: item.id, name, brand, type, category: type, stock: item.stock });
      }
      return { items, cartById: restoreCart(saved.cartById, items), notice: '' };
    }
    // Compatibilidad con las compras y existencias guardadas en Semana 1.
    const legacy = JSON.parse(window.localStorage.getItem(LEGACY_STORAGE_KEY) || 'null');
    if (legacy?.version === 1 && legacy.stockById && typeof legacy.stockById === 'object') {
      const items = products.map((item) => {
        const stock = legacy.stockById[item.id];
        return { ...item, stock: validStock(stock) && stock <= item.stock ? stock : item.stock };
      });
      return { items, cartById: restoreCart(legacy.cartById, items), notice: '' };
    }
  } catch {
    // Los datos locales inválidos o bloqueados no impiden usar la aplicación.
  }
  return initial;
}

export function ValkoraShopProvider({ children }) {
  const [shop, setShop] = useState(loadShop);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 2, items: shop.items, cartById: shop.cartById,
      }));
    } catch {
      // En modo privado o sin storage, el estado sigue funcionando en memoria.
    }
  }, [shop.items, shop.cartById]);

  const catalog = shop.items;
  const cart = catalog.filter((item) => (shop.cartById[item.id] || 0) > 0)
    .map((item) => ({ ...item, quantity: shop.cartById[item.id] }));
  const cartCount = cart.length;
  const unitsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // El formulario valida los datos antes de llamar a esta operación.
  function registerArticle({ name, brand, type, stock }) {
    const articleName = cleanText(name);
    const articleBrand = cleanText(brand);
    const articleType = cleanText(type);
    const quantity = Number(stock);
    if (!articleName || !articleBrand || !articleType || !validStock(quantity)) {
      return { ok: false, message: 'Completa nombre, marca, tipo y un stock válido.' };
    }
    if (shop.items.length >= MAX_ITEMS) return { ok: false, message: 'Se alcanzó el máximo de artículos de demostración.' };
    if (shop.items.some((item) => item.name.toLocaleLowerCase('es') === articleName.toLocaleLowerCase('es') && item.brand.toLocaleLowerCase('es') === articleBrand.toLocaleLowerCase('es'))) {
      return { ok: false, message: 'Ya existe un artículo con ese nombre y marca.' };
    }
    const nextId = Math.max(0, ...shop.items.map((item) => item.id)) + 1;
    const article = { id: nextId, name: articleName, brand: articleBrand, type: articleType, category: articleType, stock: quantity };
    setShop((current) => ({ ...current, items: [...current.items, article], notice: `${articleName} registrado en el inventario.` }));
    return { ok: true, message: `${articleName} se registró correctamente.` };
  }

  function addProduct(id) {
    setShop((current) => {
      const product = current.items.find((item) => item.id === id);
      if (!product) return current;
      const quantity = current.cartById[id] || 0;
      if (product.stock <= quantity) return { ...current, notice: `${product.name}: no quedan más unidades disponibles.` };
      return { ...current, cartById: { ...current.cartById, [id]: quantity + 1 }, notice: `${product.name} añadido al carrito.` };
    });
  }

  function removeProduct(id) {
    setShop((current) => {
      if (!(id in current.cartById)) return current;
      const cartById = { ...current.cartById };
      delete cartById[id];
      return { ...current, cartById, notice: 'Producto retirado del carrito.' };
    });
  }

  function decrementProduct(id) {
    setShop((current) => {
      const quantity = current.cartById[id] || 0;
      if (!quantity) return current;
      const cartById = { ...current.cartById };
      if (quantity === 1) delete cartById[id];
      else cartById[id] = quantity - 1;
      return { ...current, cartById, notice: '' };
    });
  }

  function selectAllAvailable() {
    setShop((current) => {
      const cartById = { ...current.cartById };
      for (const item of current.items) {
        if (item.stock > 0 && !cartById[item.id]) cartById[item.id] = 1;
      }
      return { ...current, cartById, notice: 'Productos disponibles añadidos al carrito.' };
    });
  }

  function clearCart() {
    setShop((current) => ({ ...current, cartById: {}, notice: 'Carrito vaciado.' }));
  }

  // Descuento atómico: ninguna compra parcial si las cantidades no cuadran.
  function checkout() {
    setShop((current) => {
      const entries = Object.entries(current.cartById);
      if (!entries.length) return { ...current, notice: 'El carrito está vacío.' };
      if (entries.some(([id, qty]) => {
        const item = current.items.find((product) => product.id === Number(id));
        return !item || !Number.isInteger(qty) || qty <= 0 || qty > item.stock;
      })) return { ...current, notice: 'La compra no se pudo completar: revisa las existencias disponibles.' };
      let units = 0;
      const items = current.items.map((item) => {
        const quantity = current.cartById[item.id] || 0;
        units += quantity;
        return quantity ? { ...item, stock: item.stock - quantity } : item;
      });
      return { items, cartById: {}, notice: `Compra simulada registrada: ${units} ${units === 1 ? 'unidad descontada' : 'unidades descontadas'} del inventario.` };
    });
  }

  function resetDemo() {
    setShop({ ...initialShop(), notice: 'Inventario de demostración restablecido.' });
  }

  return createElement(ShopContext.Provider, {
    value: {
      catalog, cart, cartCount, unitsCount, notice: shop.notice,
      registerArticle, addProduct, removeProduct, decrementProduct,
      selectAllAvailable, clearCart, checkout, resetDemo,
    },
  }, children);
}

export default function useValkoraShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useValkoraShop debe usarse dentro de ValkoraShopProvider.');
  return context;
}
