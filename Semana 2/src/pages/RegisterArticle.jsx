import { useState } from 'react';
import { Link } from 'react-router';
import useValkoraShop from '../hooks/useValkoraShop.js';

const EMPTY_FORM = { name: '', brand: '', type: '', stock: '0' };

export default function RegisterArticle() {
  const { catalog, registerArticle } = useValkoraShop();
  const [form, setForm] = useState(EMPTY_FORM);
  const [feedback, setFeedback] = useState(null);
  const types = [...new Set(catalog.map((item) => item.type))].sort((a, b) => a.localeCompare(b, 'es'));

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFeedback(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = registerArticle(form);
    setFeedback(result);
    if (result.ok) setForm(EMPTY_FORM);
  }

  return (
    <section className="page-section" aria-labelledby="register-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Gestión de inventario</p>
          <h1 id="register-title">Registrar artículo</h1>
          <p className="inventory-hint">Agrega productos al mismo inventario utilizado por el inicio y el carrito de Valkora.</p>
        </div>
        <span className="demo-label">Datos locales de demostración</span>
      </div>
      <div className="management-card">
        <div className="management-card-heading">
          <h2>Nuevo producto</h2>
          <p>Completa los campos obligatorios. El artículo aparecerá inmediatamente en la tabla de inventario.</p>
        </div>
        <form onSubmit={handleSubmit} className="row g-3 management-form" autoComplete="off">
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="article-name">Nombre del artículo *</label>
            <input className="form-control" id="article-name" name="name" type="text" value={form.name} onChange={handleChange} maxLength={80} required placeholder="Ej. Café molido 250 g" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="article-brand">Marca *</label>
            <input className="form-control" id="article-brand" name="brand" type="text" value={form.brand} onChange={handleChange} maxLength={80} required placeholder="Ej. Valkora" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="article-type">Tipo de producto *</label>
            <input className="form-control" id="article-type" name="type" list="valkora-product-types" value={form.type} onChange={handleChange} maxLength={80} required placeholder="Selecciona o escribe el tipo" />
            <datalist id="valkora-product-types">{types.map((type) => <option key={type} value={type} />)}</datalist>
            <div className="form-text">Puedes elegir una categoría existente o escribir una nueva.</div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="article-stock">Stock inicial *</label>
            <input className="form-control" id="article-stock" name="stock" type="number" value={form.stock} onChange={handleChange} min="0" max="100000" step="1" required />
            <div className="form-text">Desde 0 hasta 100.000 unidades.</div>
          </div>
          <div className="col-12">
            <div className="management-actions d-flex gap-3 flex-wrap align-items-center">
              <button className="btn btn-primary valkora-btn" type="submit">Guardar artículo</button>
              <Link className="btn btn-outline-secondary valkora-outline" to="/inventario">Ver inventario completo</Link>
            </div>
          </div>
          {feedback && (
            <div className="col-12" aria-live="polite" role="status">
              <div className={`alert ${feedback.ok ? 'alert-success' : 'alert-danger'} mb-0`}>{feedback.message}</div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
