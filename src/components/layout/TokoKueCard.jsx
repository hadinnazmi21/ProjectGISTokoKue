import { Star, MapPin, Clock } from "lucide-react";

export default function TokoKueCard({ toko, onClick, isActive }) {
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

  return (
    <div
      onClick={() => onClick(toko)}
      className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
        isActive ? 'border-rose-500 shadow-lg' : 'border-slate-100 hover:border-rose-200'
      }`}
    >
      {/* Gambar */}
      <div className="relative h-24 overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100">
        {toko.gambar ? (
          <img
            src={`/images/${toko.gambar}`}
            alt={toko.nama}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
              e.target.parentElement.innerHTML = `<div class="text-4xl">${getProductIcon(toko.produk)}</div>`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {getProductIcon(toko.produk)}
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-700">{toko.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-bold text-slate-800 text-sm mb-2 line-clamp-1">
          {toko.nama}
        </h4>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{toko.kelurahan}, {toko.kecamatan}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="line-clamp-1">{toko.jamBuka}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 rounded-full font-medium">
              {getProductIcon(toko.produk)} {toko.produk}
            </span>
            <span className="text-slate-500 text-xs">Sejak {toko.tahunBerdiri}</span>
          </div>
        </div>
      </div>
    </div>
  );
}