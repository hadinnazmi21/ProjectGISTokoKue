// src/components/layout/TokoCard.jsx
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TokoCard({ toko }) {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // Navigate ke TokoDetail2 dengan route /detail/:id
    navigate(`/detail/${toko.id}`);
  };

  // Helper function to get image path
  const getImagePath = (imageName) => {
    if (!imageName) return '/images/placeholder-cake.jpg';
    // Jika imageName sudah berisi path lengkap (http/https), return as is
    if (imageName.startsWith('http')) return imageName;
    // Jika hanya nama file, gabungkan dengan path folder images
    return `/images/${imageName}`;
  };

  // Format harga ke format Rupiah
  const formatRupiah = (angka) => {
    if (!angka) return 'Hubungi Toko';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={getImagePath(toko.gambar)}
          alt={toko.nama}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/f472b6/ffffff?text=Toko+Kue';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-slate-800">{toko.rating || '0.0'}</span>
        </div>

        {/* Open/Close Status Badge */}
        {toko.jam_buka && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500/95 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-xs font-semibold text-white">Buka</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Shop Name */}
        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-rose-500 transition-colors">
          {toko.nama}
        </h3>

        {/* Address */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
          <p className="text-sm text-slate-600 line-clamp-2">
            {toko.jalan || 'Alamat tidak tersedia'}
          </p>
        </div>

        {/* Opening Hours */}
        {toko.jam_buka && (
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-600">
              {toko.jam_buka}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-100 my-4"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Price or Category */}
          <div>
            <p className="text-xs text-slate-500">Kategori</p>
            <p className="text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {toko.produk || 'Toko Kue'}
            </p>
          </div>

          {/* Detail Button */}
          <button
            onClick={handleDetailClick}
            className="group/btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span className="text-sm">Lihat Detail</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
}