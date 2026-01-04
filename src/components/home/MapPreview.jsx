export default function MapPreview({ onClick }) {
  return (
    <section className="section bg-slate-50">
      <div className="container text-center">
        <h2 className="section-title">Peta Persebaran Toko Kue</h2>
        <p className="section-desc">
          Visualisasi lokasi toko kue di Kota Pekanbaru
        </p>

        <div className="mt-10 bg-white border rounded-xl p-16 shadow-sm">
          <button
            onClick={onClick}
            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-lg"
          >
            Buka Peta Interaktif
          </button>
        </div>
      </div>
    </section>
  );
}
