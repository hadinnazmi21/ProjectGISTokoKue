import { useEffect, useRef, useState, useMemo } from "react";
import { X, MapPin, Phone, Star, Clock, Calendar, Layers, Eye, EyeOff, RefreshCw } from "lucide-react";
import { getAllToko } from "../lib/SupabaseClient";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import TokoSidebar from "../components/layout/TokoSideBar";

export default function MapPage() {
  // State untuk data dari Supabase
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  // Filter states - dipindahkan ke MapPage
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [selectedProduk, setSelectedProduk] = useState("all");

  // Layer visibility states
  const [layerVisibility, setLayerVisibility] = useState({
    markers: true,
    heatmap: false
  });

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const heatmapRef = useRef(null);

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

  // ===== FILTER LOGIC - menggunakan useMemo untuk performance =====
  const filteredData = useMemo(() => {
    return data.filter(toko => {
      const matchSearch = toko.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         toko.kecamatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         toko.kelurahan.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchKecamatan = selectedKecamatan === "all" || toko.kecamatan === selectedKecamatan;
      const matchProduk = selectedProduk === "all" || toko.produk === selectedProduk;

      return matchSearch && matchKecamatan && matchProduk;
    });
  }, [data, searchQuery, selectedKecamatan, selectedProduk]);

  // ===== FETCH DATA DARI SUPABASE =====
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllToko();
      if (result.success) {
        // Transform data dari Supabase ke format yang dipakai
        const transformedData = result.data.map(item => ({
          id: item.id,
          nama: item.nama,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng),
          kecamatan: item.kecamatan || 'Tidak diketahui',
          kelurahan: item.kelurahan || 'Tidak diketahui',
          jalan: item.jalan || '-',
          produk: item.produk || 'Kue',
          jamBuka: item.jam_buka || '-',
          tahunBerdiri: item.tahun_berdiri,
          rating: item.rating || 0,
          telp: item.telp || '-',
          menuFavorit: item.menu_favorit || '-',
          gambar: item.gambar
        }));
        setData(transformedData);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===== INIT MAP ===== */
  useEffect(() => {
    // Jangan init map kalau masih loading atau ada error
    if (loading || error) return;
    
    // Jangan init ulang kalau map sudah ada
    if (leafletMapRef.current) return;

    // Pastikan mapRef.current ada
    if (!mapRef.current) return;

    leafletMapRef.current = L.map(mapRef.current).setView(
      [0.5333, 101.4333],
      12
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(leafletMapRef.current);
  }, [loading, error]);

  /* ===== LAYER 1: MARKERS - MENGGUNAKAN FILTERED DATA ===== */
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!layerVisibility.markers) return;

    // GUNAKAN filteredData BUKAN data
    filteredData.forEach(t => {
      if (!t.lat || !t.lng) return;

      // Icon berdasarkan produk
      const productIcon = getProductIcon(t.produk);
      const iconHtml = `<div style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${productIcon}</div>`;

      // Ukuran berdasarkan rating (4-5 = besar, 3-4 = sedang, <3 = kecil)
      const iconSize = t.rating >= 4.5 ? 36 : t.rating >= 4.0 ? 32 : 28;

      const customIcon = L.divIcon({
        html: `<div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        ">${iconHtml}</div>`,
        className: 'custom-marker',
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize/2, iconSize/2]
      });

      const marker = L.marker([t.lat, t.lng], { icon: customIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="width: 240px;">
            ${t.gambar ? `
              <img 
                src="/images/${t.gambar}" 
                alt="${t.nama}" 
                style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px 8px 0 0; margin: 0;"
                onerror="this.parentElement.innerHTML='<div style=\\"width:100%;height:130px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);display:flex;align-items:center;justify-content:center;font-size:48px;border-radius:8px 8px 0 0\\">${productIcon}</div>'"
              />
            ` : `<div style="width:100%;height:130px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);display:flex;align-items:center;justify-content:center;font-size:48px;border-radius:8px 8px 0 0">${productIcon}</div>`}
            <div style="padding: 12px;">
              <strong style="font-size: 17px; display: block; margin-bottom: 10px; color: #1f2937;">${t.nama}</strong>
              <div style="font-size: 13px; color: #64748b; line-height: 1.8;">
                <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 16px;">📍</span>
                  <span>${t.kecamatan}, ${t.kelurahan}</span>
                </div>
                <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 16px;">${productIcon}</span>
                  <span>${t.produk}</span>
                </div>
                <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 16px;">⭐</span>
                  <span><strong>${t.rating}/5</strong></span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 16px;">🕒</span>
                  <span>${t.jamBuka}</span>
                </div>
              </div>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('selectStore', {detail: ${t.id}}))"
                style="
                  margin-top: 10px;
                  width: 100%;
                  padding: 8px;
                  background: linear-gradient(135deg, #f43f5e, #ec4899);
                  color: white;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                  font-weight: 600;
                  font-size: 13px;
                "
              >
                Lihat Detail
              </button>
            </div>
          </div>
        `, {
          maxWidth: 260,
          className: 'custom-popup'
        });

      markersRef.current.push(marker);
    });

    // Auto-fit bounds jika ada filtered data
    if (filteredData.length > 0 && leafletMapRef.current) {
      const bounds = L.latLngBounds(filteredData.map(t => [t.lat, t.lng]));
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredData, layerVisibility.markers]);

  // Handle custom event untuk select store
  useEffect(() => {
    const handleSelectStore = (e) => {
      const storeId = e.detail;
      const store = data.find(t => t.id === storeId);
      if (store) {
        setSelectedStore(store);
      }
    };

    window.addEventListener('selectStore', handleSelectStore);
    return () => window.removeEventListener('selectStore', handleSelectStore);
  }, [data]);

  /* ===== LAYER 2: HEATMAP - MENGGUNAKAN FILTERED DATA ===== */
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Remove existing heatmap
    if (heatmapRef.current) {
      leafletMapRef.current.removeLayer(heatmapRef.current);
      heatmapRef.current = null;
    }

    if (!layerVisibility.heatmap || filteredData.length === 0) return;

    // Create heatmap points dengan intensity berdasarkan rating - GUNAKAN filteredData
    const heatPoints = filteredData.map(t => [t.lat, t.lng, t.rating / 5]);

    heatmapRef.current = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 40,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#3b82f6',
        0.3: '#06b6d4',
        0.5: '#10b981',
        0.7: '#fbbf24',
        1.0: '#ef4444'
      }
    }).addTo(leafletMapRef.current);

  }, [filteredData, layerVisibility.heatmap]);

  const toggleLayer = (layer) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleTokoSelect = (toko) => {
    setSelectedStore(toko);
    // Fly to marker location
    if (leafletMapRef.current && toko.lat && toko.lng) {
      leafletMapRef.current.flyTo([toko.lat, toko.lng], 16, {
        duration: 1.5
      });
    }
  };

  // Loading & Error States
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data toko kue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Gagal Memuat Data</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 relative pt-16">
      {/* Sidebar dengan TokoSidebar */}
      <aside className={`${isPanelOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden h-full`}>
        <TokoSidebar
          tokoList={data}
          onTokoSelect={handleTokoSelect}
          selectedToko={selectedStore}
          onClose={() => setIsPanelOpen(false)}
          // Pass filter state ke TokoSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedKecamatan={selectedKecamatan}
          setSelectedKecamatan={setSelectedKecamatan}
          selectedProduk={selectedProduk}
          setSelectedProduk={setSelectedProduk}
          filteredToko={filteredData}
        />
      </aside>

      {/* Map Container */}
      <main className="flex-1 relative h-full">
        {/* Toggle Panel Button */}
        {!isPanelOpen && (
          <button
            onClick={() => setIsPanelOpen(true)}
            className="absolute top-4 left-4 z-[1000] p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Layers className="w-5 h-5 text-slate-600" />
          </button>
        )}

        {/* Layer Control Button */}
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-xl border-2 border-slate-200 p-3" style={{marginLeft: isPanelOpen ? '0' : '60px'}}>
          <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-rose-600" />
            Kontrol Layer
          </h3>
          <div className="space-y-2">
            {[
              { key: 'markers', label: 'Marker', icon: '📍' },
              { key: 'heatmap', label: 'Heatmap', icon: '🔥' }
            ].map(layer => (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key)}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-xs ${
                  layerVisibility[layer.key]
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-rose-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{layer.icon}</span>
                  <span className="font-medium">{layer.label}</span>
                </span>
                {layerVisibility[layer.key] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div ref={mapRef} className="absolute inset-0" />

        {/* Legend */}
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-xl border-2 border-slate-200 p-4 max-w-xs">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>📊</span> Legenda
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍰</span>
              <span className="text-slate-600">Toko Kue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍫</span>
              <span className="text-slate-600">Toko Brownies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍬</span>
              <span className="text-slate-600">Toko Coklat</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🥧</span>
              <span className="text-slate-600">Toko Pie</span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-slate-500">💡 Ukuran marker = Rating toko</p>
              <p className="text-xs text-slate-500">🔥 Heatmap = Konsentrasi toko</p>
              <p className="text-xs text-rose-600 font-semibold mt-1">
                🎯 {filteredData.length} dari {data.length} toko aktif
              </p>
            </div>
          </div>
        </div>

        {/* Store Detail Card */}
        {selectedStore && (
          <div className="absolute top-20 right-4 w-80 z-[1000]">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 overflow-hidden animate-fadeUp">
              {/* Header dengan Close Button */}
              <div className="relative">
                <button
                  onClick={() => setSelectedStore(null)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur hover:bg-white rounded-lg transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Gambar Toko */}
                {selectedStore.gambar ? (
                  <div className="relative h-32 overflow-hidden bg-slate-100">
                    <img 
                      src={`/images/${selectedStore.gambar}`} 
                      alt={selectedStore.nama}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const icon = getProductIcon(selectedStore.produk);
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-rose-100 to-pink-100">${icon}</div>`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="text-lg font-bold text-white drop-shadow-lg truncate">
                        {selectedStore.nama}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-32 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <div className="text-4xl">{getProductIcon(selectedStore.produk)}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="text-lg font-bold text-white drop-shadow-lg truncate">
                        {selectedStore.nama}
                      </h3>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-700 truncate">{selectedStore.jalan}</p>
                    <p className="text-slate-500 text-xs truncate">{selectedStore.kelurahan}, {selectedStore.kecamatan}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">Rating: {selectedStore.rating}/5</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-slate-600">{selectedStore.jamBuka}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-slate-600">Sejak {selectedStore.tahunBerdiri}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span className="text-slate-600">{selectedStore.telp}</span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-slate-500 text-xs mb-1.5">Menu Favorit</p>
                  <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-medium rounded-full">
                    {selectedStore.menuFavorit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}