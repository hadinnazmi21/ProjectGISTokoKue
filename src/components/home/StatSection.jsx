import StatBox from "../layout/StatBox";

export default function StatSection({ tokoData }) {
  const totalToko = tokoData.length;
  const totalKue = tokoData.filter(t => t.produk === "Kue").length;
  const totalBrownies = tokoData.filter(t => t.produk === "Brownies").length;
  const avgRating = (
    tokoData.reduce((s, t) => s + t.rating, 0) / totalToko
  ).toFixed(1);

  return (
    <section className="section bg-slate-50">
      <div className="container">
        <h2 className="section-title">Statistik Toko Kue</h2>
        <p className="section-desc">
          Ringkasan data toko kue berdasarkan kategori dan rating
        </p>

        <StatBox
          stats={[
            { label: "Total Toko", value: totalToko, icon: "🏪" },
            { label: "Toko Kue", value: totalKue, icon: "🎂" },
            { label: "Toko Brownies", value: totalBrownies, icon: "🍫" },
            { label: "Rating Rata-rata", value: avgRating, icon: "⭐" },
          ]}
        />
      </div>
    </section>
  );
}
