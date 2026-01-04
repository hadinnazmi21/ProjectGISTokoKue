export default function FilterPanel({
  kecamatanList,
  kelurahanList,
  produkList,
  selectedKecamatan,
  selectedKelurahan,
  selectedProduk,
  onKecamatanChange,
  onKelurahanChange,
  onProdukChange,
  onReset,
}) {
  return (
    <div className="p-4 bg-white h-full">
      <h3 className="font-semibold text-slate-800 mb-4">
        Filter Data Toko
      </h3>

      <div className="space-y-4">
        {[{
          value: selectedKecamatan,
          onChange: onKecamatanChange,
          list: kecamatanList,
          all: "Semua Kecamatan"
        },{
          value: selectedKelurahan,
          onChange: onKelurahanChange,
          list: kelurahanList,
          all: "Semua Kelurahan"
        },{
          value: selectedProduk,
          onChange: onProdukChange,
          list: produkList,
          all: "Semua Produk"
        }].map((f, i) => (
          <select
            key={i}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-rose-200"
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
          >
            {f.list.map(v => (
              <option key={v} value={v}>
                {v === "all" ? f.all : v}
              </option>
            ))}
          </select>
        ))}

        <button
          onClick={onReset}
          className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 py-2 rounded"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}
