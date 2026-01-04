import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import TokoKueCard from "./TokoKueCard";

export default function TokoSidebar({ 
  tokoList, 
  onTokoSelect,
  selectedToko,
  onClose,
  filteredCount,
  totalCount
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [selectedProduk, setSelectedProduk] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values
  const kecamatanList = ["all", ...new Set(tokoList.map(t => t.kecamatan).filter(Boolean))];
  const produkList = ["all", ...new Set(tokoList.map(t => t.produk))];

  // Function untuk mendapatkan icon berdasarkan produk
  const getProductIcon = (produk) => {
    const icons = {
      "Kue": "🍰",
      "Brownies": "🍫",
      "Coklat": "🍬",
      "Pie": "🥧"
    };
    return icons[produk] || "🍰";
  };

  // Filter logic
  const filteredToko = tokoList.filter(toko => {
    const matchSearch = toko.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       toko.kecamatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       toko.kelurahan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchKecamatan = selectedKecamatan === "all" || toko.kecamatan === selectedKecamatan;
    const matchProduk = selectedProduk === "all" || toko.produk === selectedProduk;

    return matchSearch && matchKecamatan && matchProduk;
  });

  const handleReset = () => {
    setSearchQuery("");
    setSelectedKecamatan("all");
    setSelectedProduk("all");
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-xl border-r border-slate-200">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🍰 Daftar Toko Kue
            </h2>
            <p className="text-rose-100 text-sm mt-1">
              Menampilkan {filteredToko.length} dari {tokoList.length} toko
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari toko..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-white/20 bg-white/95 focus:bg-white focus:border-white focus:ring-2 focus:ring-rose-200 transition-all outline-none text-sm"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="flex-shrink-0 bg-gradient-to-br from-rose-50 to-pink-50 p-4 border-b border-rose-100">
          <div className="space-y-3">
            {/* Kecamatan Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kecamatan
              </label>
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="w-full px-3 py-2 border-2 border-rose-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none text-sm bg-white"
              >
                <option value="all">Semua Kecamatan</option>
                {kecamatanList.filter(k => k !== "all").map(kec => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
              </select>
            </div>

            {/* Produk Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jenis Produk
              </label>
              <select
                value={selectedProduk}
                onChange={(e) => setSelectedProduk(e.target.value)}
                className="w-full px-3 py-2 border-2 border-rose-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none text-sm bg-white"
              >
                <option value="all">Semua Produk</option>
                {produkList.filter(p => p !== "all").map(prod => (
                  <option key={prod} value={prod}>
                    {getProductIcon(prod)} {prod}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-2 bg-white border-2 border-rose-300 text-rose-600 font-semibold rounded-lg hover:bg-rose-50 transition-all text-sm"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredToko.length > 0 ? (
            filteredToko.map(toko => (
              <TokoKueCard
                key={toko.id}
                toko={toko}
                onClick={onTokoSelect}
                isActive={selectedToko?.id === toko.id}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-500 font-medium">Tidak ada toko ditemukan</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}