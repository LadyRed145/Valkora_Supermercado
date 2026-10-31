import { Link } from 'react-router';
import { getStockStatus } from '../data/products.js';
import useValkoraShop from '../hooks/useValkoraShop.js';

export default function Inventory() {
  const { catalog } = useValkoraShop();
  return (
    <section className="page-section" aria-labelledby="inventory-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Gestión de inventario</p>
          <h1 id="inventory-title">Inventario completo</h1>
          <p className="inventory-hint">Consulta los artículos originales y los que registraste. Todos comparten el mismo estado global.</p>
        </div>
        <span className="demo-label">{catalog.length} artículos</span>
      </div>
      <div className="management-card">
        <div className="management-card-heading management-card-heading-row">
          <div><h2>Artículos disponibles en el sistema</h2><p>Las existencias se actualizan al confirmar compras simuladas desde Inicio.</p></div>
          <Link className="btn btn-primary valkora-btn" to="/registrar-articulo">+ Registrar artículo</Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 management-table">
            <thead><tr><th scope="col">#</th><th scope="col">Nombre</th><th scope="col">Marca</th><th scope="col">Tipo</th><th scope="col">Stock</th><th scope="col">Estado</th></tr></thead>
            <tbody>
              {catalog.map((item) => {
                const status = getStockStatus(item.stock);
                return <tr key={item.id}>
                  <th scope="row">{item.id}</th>
                  <td className="fw-semibold">{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.type}</td>
                  <td>{item.stock}</td>
                  <td><span className={`stock-pill ${status.className}`}>{status.label}</span></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        <p className="management-footnote">Inventario compartido mediante React Context y guardado localmente en este navegador.</p>
      </div>
    </section>
  );
}
