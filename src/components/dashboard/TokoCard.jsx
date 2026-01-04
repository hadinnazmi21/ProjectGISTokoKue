// src/components/dashboard/TokoCard.jsx
import { MapPin, Star, Clock, Calendar, Edit, Trash2 } from 'lucide-react';

export default function TokoCard({ toko, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 hover:border-rose-300 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {toko.gambar ? (
          <img
            src={`/images/${toko.gambar}`}
            alt={toko.nama}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-rose-100 to-pink-100">🍰</div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-rose-100 to-pink-100">
            {toko.produk === 'Kue' ? '🍰' : '🍫'}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-slate-800">{toko.rating}</span>
        </div>

        {/* Produk Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-lg">
          <span className="text-xs font-bold">{toko.produk}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-1">
          {toko.nama}
        </h3>

        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{toko.jalan}, {toko.kelurahan}, {toko.kecamatan}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>{toko.jam_buka || toko.jamBuka}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>Sejak {toko.tahun_berdiri || toko.tahunBerdiri}</span>
          </div>
        </div>

        {/* Menu Favorit */}
        <div className="mb-4 pb-4 border-b border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Menu Favorit</p>
          <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-full">
            {toko.menu_favorit || toko.menuFavorit}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(toko)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors border border-blue-200"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>

          <button
            onClick={() => onDelete(toko)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}