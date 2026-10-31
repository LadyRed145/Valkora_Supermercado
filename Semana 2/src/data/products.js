// Datos de demostración para la actividad formativa: sin backend ni base de datos.
export const products = [
  { id: 1, name: 'Arroz 1 kg', brand: 'Valkora', type: 'Abarrotes', category: 'Abarrotes', stock: 30 },
  { id: 2, name: 'Leche 1 L', brand: 'Valkora', type: 'Lácteos', category: 'Lácteos', stock: 5 },
  { id: 3, name: 'Aceite 900 ml', brand: 'Valkora', type: 'Abarrotes', category: 'Abarrotes', stock: 0 },
  { id: 4, name: 'Manzanas 1 kg', brand: 'Valkora', type: 'Frutas y verduras', category: 'Frutas y verduras', stock: 18 },
  { id: 5, name: 'Pan de molde', brand: 'Valkora', type: 'Panadería', category: 'Panadería', stock: 8 },
  { id: 6, name: 'Huevos (12 unidades)', brand: 'Valkora', type: 'Huevos', category: 'Huevos', stock: 23 },
];

// Un solo umbral para las etiquetas de estado y el resumen del inventario.
export const LOW_STOCK_THRESHOLD = 8;

export function getStockStatus(stock) {
  if (stock === 0) return { label: 'Agotado', className: 'stock-out' };
  if (stock <= LOW_STOCK_THRESHOLD) return { label: 'Stock bajo', className: 'stock-low' };
  return { label: 'Disponible', className: 'stock-ok' };
}
