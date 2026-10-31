import { LOW_STOCK_THRESHOLD } from '../data/products.js';

const questions = [
  { id: 'inventory', question: '¿Los productos del inventario son reales?', answer: 'No. Los productos y sus cantidades son datos de ejemplo para demostrar la interfaz del supermercado.' },
  { id: 'locations', question: '¿Dónde se encuentran las tiendas?', answer: 'Valkora y sus sucursales son ficticias: forman parte de un proyecto académico.' },
  { id: 'stock', question: '¿Qué significa “stock bajo”?', answer: `En este ejemplo, el estado “stock bajo” se muestra cuando quedan entre 1 y ${LOW_STOCK_THRESHOLD} unidades.` },
  { id: 'orders', question: '¿Puedo comprar desde este sitio?', answer: 'Puedes añadir productos al carrito y confirmar una compra simulada. Las existencias se descuentan dentro de este navegador; no se procesan pagos ni pedidos reales.' },
];

export default function FAQ() {
  return (
    <section className="section page-section" aria-labelledby="faq-title">
      <p className="eyebrow dark">Estamos para ayudarte</p>
      <h1 id="faq-title">Preguntas frecuentes</h1>
      <p className="section-intro">Respuestas rápidas sobre el inventario y el funcionamiento de esta demostración.</p>
      <div className="faq-list">
        {questions.map((item) => (
          <article className="faq-item" key={item.id}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
