import { useCallback, useState } from 'react';
import { getStockStatus, LOW_STOCK_THRESHOLD } from '../data/products.js';
import MetricIcon from '../components/MetricIcon.jsx';
import CartPanel from '../components/CartPanel.jsx';
import useValkoraShop from '../hooks/useValkoraShop.js';
import heroBasket from '../assets/valkora-basket.webp';

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const {
    catalog, cart, cartCount, unitsCount, notice, addProduct, removeProduct,
    decrementProduct, selectAllAvailable, clearCart, checkout, resetDemo,
  } = useValkoraShop();

  // Indicadores derivados del estado real del inventario, nunca valores fijos.
  const available = catalog.filter((product) => product.stock > 0).length;
  const lowStock = catalog.filter((product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD).length;
  const allAvailableInCart = available > 0 && catalog.filter((product) => product.stock > 0)
    .every((product) => cart.some((entry) => entry.id === product.id));

  function handleReset() {
    if (window.confirm('¿Restablecer los seis artículos originales, eliminar los nuevos y vaciar el carrito?')) {
      resetDemo();
    }
  }

  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Bienvenido a Valkora</p>
          <h1 id="home-title">El valor de tener <span>todo en orden.</span></h1>
          <p>Consulta nuestro inventario de ejemplo y conoce el supermercado Valkora.</p>
          <span className="hero-rule" aria-hidden="true" />
        </div>
        <div className="hero-visual" aria-hidden="true"><img src={heroBasket} alt="" loading="eager" /></div>
        <div className="hero-sparkles" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      </section>

      <section className="section" aria-labelledby="stock-title">
        <div className="section-heading">
          <div><p className="eyebrow dark">Control de productos</p><h2 id="stock-title">Resumen de inventario</h2></div>
          <span className="demo-label">Datos de demostración</span>
        </div>
        <div className="stats-grid">
          <article className="stat-card"><span className="stat-icon"><MetricIcon kind="package" /></span><div className="stat-text"><span>Total de productos</span><strong>{catalog.length}</strong></div></article>
          <article className="stat-card"><span className="stat-icon"><MetricIcon kind="basket" /></span><div className="stat-text"><span>Con existencias</span><strong>{available}</strong></div></article>
          <article className="stat-card"><span className="stat-icon"><MetricIcon kind="warning" /></span><div className="stat-text"><span>Stock bajo</span><strong>{lowStock}</strong></div></article>
        </div>

        <div className="commerce-grid">
          <div className="inventory-card">
            <div className="inventory-heading">
              <div><h3>Productos registrados</h3><p className="inventory-hint">Selecciona productos para agregarlos al carrito. Abre el carrito lateral para ajustar las cantidades.</p></div>
              <span>{catalog.length} artículos</span>
            </div>
            <div className="inventory-toolbar">
              <label className="select-all-label">
                <input type="checkbox" checked={allAvailableInCart} disabled={available === 0} onChange={(e) => e.target.checked ? selectAllAvailable() : clearCart()} aria-label="Seleccionar todos los productos disponibles" />
                Seleccionar disponibles
              </label>
              <span className="selection-count" role="status" aria-live="polite">{cartCount} de {available} disponibles en el carrito</span>
              <button type="button" className="selection-clear" onClick={clearCart} disabled={cartCount === 0}>Limpiar selección</button>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th scope="col">Producto</th><th scope="col">Categoría</th><th scope="col">Stock</th><th scope="col">Estado</th></tr></thead>
                <tbody>
                  {catalog.map((product) => {
                    const status = getStockStatus(product.stock);
                    const isSelected = cart.some((item) => item.id === product.id);
                    return (
                      <tr key={product.id} className={isSelected ? 'inventory-row-selected' : undefined}>
                        <td className="product-name">
                          <label className="product-selection-label">
                            <input type="checkbox" checked={isSelected} disabled={product.stock === 0} onChange={() => isSelected ? removeProduct(product.id) : addProduct(product.id)} aria-label={`Seleccionar ${product.name}`} />
                            <span>{product.name}</span>
                          </label>
                        </td>
                        <td>{product.category}</td>
                        <td>{product.stock}</td>
                        <td><span className={`stock-pill ${status.className}`}>{status.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="inventory-footer">
              <p>El stock se descuenta solamente cuando confirmas una compra simulada. Los productos agotados no pueden agregarse.</p>
              <button type="button" className="reset-demo" onClick={handleReset}>Restablecer inventario demo</button>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="cart-launcher"
          onClick={() => setIsCartOpen(true)}
          aria-haspopup="dialog"
          aria-controls="valkora-cart-drawer"
          aria-expanded={isCartOpen}
          aria-label={`Abrir carrito de compras, ${unitsCount} ${unitsCount === 1 ? 'unidad' : 'unidades'}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l2.8 12.2A2 2 0 0 0 8.75 17H19a2 2 0 0 0 1.95-1.55L22 8H5"/></svg>
          <span>Mi carrito</span>
          <strong className="cart-launcher-count" aria-hidden="true">{unitsCount}</strong>
        </button>
        <CartPanel
          isOpen={isCartOpen}
          onClose={closeCart}
          cart={cart}
          unitsCount={unitsCount}
          notice={notice}
          addProduct={addProduct}
          decrementProduct={decrementProduct}
          removeProduct={removeProduct}
          clearCart={clearCart}
          checkout={checkout}
        />
      </section>
    </>
  );
}
