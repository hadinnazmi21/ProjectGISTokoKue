// src/pages/TokoDetail2.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Star, Phone, Calendar, 
  ArrowLeft, Map as MapIcon, Utensils, Building2,
  Share2, Heart, Image as ImageIcon,
  ChevronLeft, ChevronRight, Info, Award, Map
} from 'lucide-react';
import { getTokoById } from '../lib/SupabaseClient';

function TokoDetail2() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [toko, setToko] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper function to get image path
  const getImagePath = (imageName) => {
    if (!imageName) return '/images/placeholder-cake.jpg';
    if (imageName.startsWith('http')) return imageName;
    return `/images/${imageName}`;
  };

  // Fetch detail toko
  useEffect(() => {
    fetchTokoDetail();
  }, [id]);

  const fetchTokoDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getTokoById(id);
      
      if (result.success) {
        setToko(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Gagal mengambil detail toko');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openInternalMap = () => {
    if (toko?.lat && toko?.lng) {
      // Navigate ke MapPage dengan state yang berisi koordinat dan id toko
      navigate('/map', { 
        state: { 
          focusLat: parseFloat(toko.lat),
          focusLng: parseFloat(toko.lng),
          focusTokoId: toko.id,
          focusTokoName: toko.nama
        } 
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: toko.nama,
      text: `Lihat ${toko.nama} - ${toko.produk}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const images = [
    toko?.gambar ? getImagePath(toko.gambar) : null,
    toko?.gambarmenu ? getImagePath(toko.gambarmenu) : null
  ].filter(Boolean);

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-semibold text-lg animate-pulse">
            Memuat detail toko...
          </p>
        </div>
      </div>
    );
  }

  if (error || !toko) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Toko Tidak Ditemukan</h2>
          <p className="text-slate-600 mb-8">{error || 'Data toko tidak tersedia'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Kembali</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-rose-500 text-white shadow-lg scale-110'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="grid lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 relative h-96 lg:h-[600px] group cursor-pointer" onClick={() => openImageModal(0)}>
              <img
                src={getImagePath(toko.gambar)}
                alt={toko.nama}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600/f472b6/ffffff?text=Toko+Kue';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute top-6 right-6 flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-800">{toko.rating || '0.0'}</div>
                  <div className="text-xs text-slate-500">Rating</div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <ImageIcon className="w-4 h-4" />
                    <span>{images.length} Foto</span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-slate-800">Klik untuk perbesar</span>
              </div>
            </div>

            <div className="lg:col-span-2 p-8 flex flex-col">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full w-fit mb-4">
                <Building2 className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-semibold text-rose-700">{toko.produk || 'Toko Kue'}</span>
              </div>

              <h1 className="text-4xl font-bold text-slate-800 mb-6 leading-tight">
                {toko.nama}
              </h1>

              <div className="space-y-4 flex-grow">
                {toko.jam_buka && (
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="p-2 bg-emerald-500 rounded-xl">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Jam Buka</p>
                      <p className="text-slate-800 font-semibold">{toko.jam_buka}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Alamat</p>
                    <p className="text-slate-800 font-medium text-sm leading-relaxed">
                      {toko.jalan}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Kel. {toko.kelurahan}, Kec. {toko.kecamatan}
                    </p>
                  </div>
                </div>

                {toko.telp && (
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="p-2 bg-purple-500 rounded-xl">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-purple-600 uppercase mb-1">Telepon</p>
                      <a
                        href={`tel:${toko.telp}`}
                        className="text-purple-700 font-semibold hover:text-purple-900 transition-colors"
                      >
                        {toko.telp}
                      </a>
                    </div>
                  </div>
                )}

                {toko.tahun_berdiri && (
                  <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="p-2 bg-amber-500 rounded-xl">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-amber-600 uppercase mb-1">Berdiri Sejak</p>
                      <p className="text-slate-800 font-semibold">{toko.tahun_berdiri}</p>
                    </div>
                  </div>
                )}
              </div>

              
              
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
                activeTab === 'info'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Info className="w-5 h-5" />
              <span>Informasi</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Utensils className="w-5 h-5" />
              <span>Menu</span>
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
                activeTab === 'location'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Map className="w-5 h-5" />
              <span>Lokasi</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-rose-100 rounded-xl">
                    <Info className="w-6 h-6 text-rose-600" />
                  </div>
                  Tentang Toko
                </h2>
                {toko.deskripsi ? (
                  <p className="text-slate-700 leading-relaxed text-lg bg-slate-50 p-6 rounded-2xl">
                    {toko.deskripsi}
                  </p>
                ) : (
                  <p className="text-slate-500 italic">Deskripsi belum tersedia</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-yellow-600" />
                    <h3 className="text-xl font-bold text-slate-800">Rating Toko</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
                    <span className="text-4xl font-bold text-slate-800">
                      {toko.rating || '0.0'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 ${
                        star <= Math.round(toko.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <Utensils className="w-6 h-6 text-rose-600" />
                </div>
                Menu & Produk
              </h2>

              {toko.menu_favorit && (
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                  <p className="text-sm font-semibold text-rose-600 uppercase mb-2">Menu Favorit</p>
                  <p className="text-xl font-bold text-slate-800">{toko.menu_favorit}</p>
                </div>
              )}

              {toko.gambarmenu && (
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl cursor-pointer group" onClick={() => openImageModal(1)}>
                  <img
                    src={getImagePath(toko.gambarmenu)}
                    alt="Menu"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600/f472b6/ffffff?text=Menu';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-sm font-medium text-slate-800">Klik untuk perbesar</span>
                  </div>
                </div>
              )}

              {!toko.menu_favorit && !toko.gambarmenu && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl">
                  <Utensils className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">Informasi menu belum tersedia</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <Map className="w-6 h-6 text-rose-600" />
                </div>
                Lokasi & Petunjuk Arah
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-600 uppercase mb-2">Jalan</p>
                  <p className="text-slate-800 font-medium text-lg">{toko.jalan}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-600 uppercase mb-2">Kelurahan</p>
                  <p className="text-slate-800 font-medium text-lg">{toko.kelurahan}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-600 uppercase mb-2">Kecamatan</p>
                  <p className="text-slate-800 font-medium text-lg">{toko.kecamatan}</p>
                </div>
                {toko.lat && toko.lng && (
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <p className="text-sm font-semibold text-blue-600 uppercase mb-2">Koordinat</p>
                    <p className="text-slate-800 font-medium">
                      {parseFloat(toko.lat).toFixed(6)}, {parseFloat(toko.lng).toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {toko.lat && toko.lng && (
  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
    <MapIcon className="w-16 h-16 mx-auto mb-4" />
    <h3 className="text-2xl font-bold mb-3">Lihat Lokasi di Peta</h3>
    <p className="mb-6 text-blue-100">
      Buka peta interaktif untuk melihat lokasi toko ini
    </p>
    <button
      onClick={openInternalMap}
      className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
    >
      Buka Peta Interaktif
    </button>
  </div>
)}

            </div>
          )}
        </div>
      </div>

      {showImageModal && images.length > 0 && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
          >
            ✕
          </button>

          <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentImageIndex]}
              alt="Preview"
              className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600/f472b6/ffffff?text=Image';
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 p-4 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 p-4 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="text-white font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TokoDetail2;