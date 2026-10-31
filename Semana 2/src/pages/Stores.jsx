const stores = [
  { id: 'norte', name: 'Valkora Norte', description: 'Variedad de alimentos y artículos esenciales en un mismo lugar.' },
  { id: 'centro', name: 'Valkora Centro', description: 'Nuestra sucursal principal, con productos para las compras de cada día.' },
  { id: 'costa', name: 'Valkora Costa', description: 'Una sucursal acogedora, pensada para abastecer a toda la familia.' },
];

export default function Stores() {
  return (
    <section className="section page-section" aria-labelledby="stores-title">
      <p className="eyebrow dark">Cerca de ti</p>
      <h1 id="stores-title">Nuestras tiendas</h1>
      <p className="section-intro">Conoce las sucursales ficticias de Valkora, creadas para esta actividad formativa.</p>
      <div className="info-grid">
        {stores.map((store, index) => (
          <article className="info-card" key={store.id}>
            <span className="card-index">0{index + 1}</span>
            <h2>{store.name}</h2>
            <p>{store.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
