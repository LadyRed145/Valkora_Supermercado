import { useEffect, useState } from 'react';
import { products } from '../data/products.js';

// Compra de demostración 100% local. No gestiona pagos ni inventario compartido.
const STORAGE_KEY = 'valkora:supermercado:demo:v1';
const validIds = new Set(products.map(({ id }) => String(id)));
const baseStock = () => Object.fromEntries(products.map(({ id, stock }) => [id, stock]));
const initialShop = () => ({ stockById: baseStock(), cartById: {}, notice: '' });
const safeInt = (value) => Number.isInteger(value) && value >= 0 ? value : null;

// Valida el almacenamiento antes de restaurarlo para impedir cantidades inválidas.
function loadShop() {
  const initial = initialShop();
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || saved.version !== 1 || typeof saved.stockById !== 'object' || !saved.stockById || typeof saved.cartById !== 'object' || !saved.cartById) return initial;
    const stockById = { ...initial.stockById };
    const cartById = {};
    for (const product of products) {
      const key = String(product.id);
      const restored = safeInt(saved.stockById[key]);
      if (restored !== null && restored <= product.stock) stockById[key] = restored;
      const quantity = safeInt(saved.cartById[key]);
      if (quantity && quantity <= stockById[key]) cartById[key] = quantity;
    }
    return { stockById, cartById, notice: '' };
  } catch {
    return initial; // Storage puede estar bloqueado o contener JSON inválido.
  }
}

export default function useValkoraShop() {
  const [shop, setShop] = useState(loadShop);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1, stockById: shop.stockById, cartById: shop.cartById,
      }));
    } catch {
      // En navegadores que bloquean storage, el carrito funciona durante la sesión.
    }
  }, [shop.stockById, shop.cartById]);

  const catalog = products.map((product) => ({ ...product, stock: shop.stockById[product.id] ?? product.stock }));
  const cart = catalog.filter((item) => (shop.cartById[item.id] || 0) > 0)
    .map((item) => ({ ...item, quantity: shop.cartById[item.id] }));
  const cartCount = cart.length;
  const unitsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addProduct(id) {
    if (!validIds.has(String(id))) return;
    setShop((current) => {
      const product = products.find((p) => p.id === id);
      const stock = current.stockById[id];
      const quantity = current.cartById[id] || 0;
      if (stock <= quantity) return { ...current, notice: `${product.name}: no quedan más unidades disponibles.` };
      return { ...current, cartById: { ...current.cartById, [id]: quantity + 1 }, notice: `${product.name} añadido al carrito.` };
    });
  }

  function removeProduct(id) {
    if (!validIds.has(String(id))) return;
    setShop((current) => {
      const cartById = { ...current.cartById };
      delete cartById[id];
      return { ...current, cartById, notice: 'Producto retirado del carrito.' };
    });
  }

  function decrementProduct(id) {
    if (!validIds.has(String(id))) return;
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
      for (const product of products) {
        if (current.stockById[product.id] > 0 && !cartById[product.id]) cartById[product.id] = 1;
      }
      return { ...current, cartById, notice: 'Productos disponibles añadidos al carrito.' };
    });
  }

  function clearCart() {
    setShop((current) => ({ ...current, cartById: {}, notice: 'Carrito vaciado.' }));
  }

  // La operación completa se aplica sobre un mismo estado: evita descontar stock parcialmente.
  function checkout() {
    setShop((current) => {
      const entries = Object.entries(current.cartById);
      if (!entries.length) return { ...current, notice: 'El carrito está vacío.' };
      if (entries.some(([id, qty]) => !validIds.has(id) || !Number.isInteger(qty) || qty <= 0 || qty > current.stockById[id])) {
        return { ...current, notice: 'La compra no se pudo completar: revisa las existencias disponibles.' };
      }
      const stockById = { ...current.stockById };
      let units = 0;
      for (const [id, qty] of entries) {
        stockById[id] -= qty;
        units += qty;
      }
      return { stockById, cartById: {}, notice: `Compra simulada registrada: ${units} ${units === 1 ? 'unidad descontada' : 'unidades descontadas'} del inventario.` };
    });
  }

  function resetDemo() {
    setShop({ ...initialShop(), notice: 'Inventario de demostración restablecido.' });
  }

  return {
    catalog, cart, cartCount, unitsCount, notice: shop.notice,
    addProduct, removeProduct, decrementProduct, selectAllAvailable,
    clearCart, checkout, resetDemo,
  };
}
