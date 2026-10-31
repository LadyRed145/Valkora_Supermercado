import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Carrito offcanvas inspirado en el comportamiento del carrito NatGamez.
// La lógica de inventario y compra permanece en useValkoraShop.
export default function CartPanel({
  isOpen, onClose, cart, unitsCount, notice,
  addProduct, decrementProduct, removeProduct, clearCart, checkout,
}) {
  const drawerRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Al abrir: bloquea el scroll de fondo, atrapa el foco y permite cerrar con Escape.
  // Al cerrar: libera eventos y devuelve el foco al botón de apertura.
  useEffect(() => {
    if (!isOpen) return undefined;

    lastFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector('.cart-close')?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const elements = [...drawerRef.current.querySelectorAll(
        'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )];
      if (!elements.length) { event.preventDefault(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === drawerRef.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    const onFocusIn = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        drawerRef.current.querySelector('.cart-close')?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      if (lastFocusedRef.current?.isConnected) lastFocusedRef.current.focus();
    };
  }, [isOpen, onClose]);

  return createPortal(
    <div className={`valkora-cart-layer${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div className="cart-scrim" onClick={onClose} aria-hidden="true" />
      <aside
        ref={drawerRef}
        id="valkora-cart-drawer"
        className="cart-panel cart-drawer"
        role="dialog"
        aria-modal={isOpen ? 'true' : undefined}
        aria-labelledby="cart-title"
        tabIndex={-1}
      >
        <div className="cart-panel-header">
          <div>
            <p className="eyebrow dark">Tu selección</p>
            <h3 id="cart-title">Mi carrito</h3>
          </div>
          <div className="cart-header-actions">
            <span className="cart-counter" aria-label={`${unitsCount} unidades en el carrito`}>{unitsCount}</span>
            <button className="cart-close" type="button" aria-label="Cerrar carrito" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="cart-drawer-scroll">
          {cart.length ? (
            <ul className="cart-list">
              {cart.map((product) => (
                <li key={product.id} className="cart-item">
                  <div className="cart-item-head">
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.stock} {product.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}</small>
                    </div>
                    <button type="button" className="cart-remove" aria-label={`Quitar ${product.name} del carrito`} title="Quitar producto" onClick={() => removeProduct(product.id)}>×</button>
                  </div>
                  <div className="quantity-control" aria-label={`Cantidad de ${product.name}`}>
                    <button type="button" aria-label={`Disminuir cantidad de ${product.name}`} onClick={() => decrementProduct(product.id)}>−</button>
                    <output aria-label={`Cantidad seleccionada de ${product.name}`}>{product.quantity}</output>
                    <button type="button" aria-label={`Aumentar cantidad de ${product.name}`} onClick={() => addProduct(product.id)} disabled={product.quantity >= product.stock}>+</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="cart-empty">
              <span className="cart-empty-icon" aria-hidden="true">✦</span>
              <p>Tu carrito está vacío.</p>
              <small>Selecciona productos del inventario y aparecerán aquí.</small>
            </div>
          )}
        </div>
        <div className="cart-drawer-bottom">
          {cart.length > 0 && (
            <>
              <div className="cart-totals">
                <span>Productos diferentes</span><strong>{cart.length}</strong>
                <span>Unidades seleccionadas</span><strong>{unitsCount}</strong>
              </div>
              <div className="cart-actions">
                <button type="button" className="cart-checkout" onClick={checkout}>Confirmar compra simulada</button>
                <button type="button" className="cart-clear" onClick={clearCart}>Vaciar carrito</button>
              </div>
            </>
          )}
          <p className="cart-feedback" role="status" aria-live="polite">{notice || 'Las existencias se descuentan al confirmar la compra.'}</p>
          <p className="cart-disclaimer">Simulación local: no se realizan pagos ni pedidos reales.</p>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
