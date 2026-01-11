import { X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TokoForm({ toko, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    nama: '',
    lat: '',
    lng: '',
    kecamatan: '',
    kelurahan: '',
    jalan: '',
    produk: 'Kue',
    jam_buka: '',
    tahun_berdiri: new Date().getFullYear(),
    rating: 4.5,
    telp: '',
    menu_favorit: '',
    deskripsi: '',
    gambar: '',
    gambarmenu: ''
  });

  useEffect(() => {
    if (toko) {
      setFormData({
        nama: toko.nama || '',
        lat: toko.lat || '',
        lng: toko.lng || '',
        kecamatan: toko.kecamatan || '',
        kelurahan: toko.kelurahan || '',
        jalan: toko.jalan || '',
        produk: toko.produk || 'Kue',
        jam_buka: toko.jam_buka || '',
        tahun_berdiri: toko.tahun_berdiri || new Date().getFullYear(),
        rating: toko.rating || 4.5,
        telp: toko.telp || '',
        menu_favorit: toko.menu_favorit || '',
        deskripsi: toko.deskripsi || '',
        gambar: toko.gambar || '',
        gambarmenu: toko.gambarmenu || ''
      });
    }
  }, [toko]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      rating: parseFloat(formData.rating),
      tahun_berdiri: parseInt(formData.tahun_berdiri)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">
            {toko ? 'Edit Toko' : 'Tambah Toko'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="text-white w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Toko */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama Toko <span className="text-red-500">*</span>
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="nama" 
              value={formData.nama} 
              onChange={handleChange} 
              placeholder="Contoh: Toko Kue Mawar" 
              required 
            />
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Latitude <span className="text-red-500">*</span>
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="lat" 
              value={formData.lat} 
              onChange={handleChange} 
              placeholder="0.5333" 
              type="number"
              step="any"
              required 
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Longitude <span className="text-red-500">*</span>
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="lng" 
              value={formData.lng} 
              onChange={handleChange} 
              placeholder="101.4333" 
              type="number"
              step="any"
              required 
            />
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kecamatan
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="kecamatan" 
              value={formData.kecamatan} 
              onChange={handleChange} 
              placeholder="Contoh: Tampan" 
            />
          </div>

          {/* Kelurahan */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kelurahan
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="kelurahan" 
              value={formData.kelurahan} 
              onChange={handleChange} 
              placeholder="Contoh: Tuah Karya" 
            />
          </div>

          {/* Alamat Jalan */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Alamat Jalan
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="jalan" 
              value={formData.jalan} 
              onChange={handleChange} 
              placeholder="Contoh: Jl. HR. Soebrantas No. 155" 
            />
          </div>

          {/* Jenis Produk */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Jenis Produk <span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none bg-white" 
              name="produk" 
              value={formData.produk} 
              onChange={handleChange}
            >
              <option value="Kue">🍰 Kue</option>
              <option value="Brownies">🍫 Brownies</option>
              <option value="Coklat">🍬 Coklat</option>
              <option value="Pie">🥧 Pie</option>
              <option value="Oleh-Oleh">🎁 Oleh-Oleh</option>
            </select>
          </div>

          {/* Jam Buka */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Jam Buka
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="jam_buka" 
              value={formData.jam_buka} 
              onChange={handleChange} 
              placeholder="Contoh: 08:00 - 21:00" 
            />
          </div>

          {/* Tahun Berdiri */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tahun Berdiri
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="tahun_berdiri" 
              value={formData.tahun_berdiri} 
              onChange={handleChange}
              type="number"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Rating (1-5)
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="rating" 
              value={formData.rating} 
              onChange={handleChange}
              type="number"
              min="1"
              max="5"
              step="0.1"
            />
          </div>

          {/* No Telp */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              No. Telepon
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="telp" 
              value={formData.telp} 
              onChange={handleChange} 
              placeholder="Contoh: 0812-3456-7890" 
            />
          </div>

          {/* Menu Favorit */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Menu Favorit
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="menu_favorit" 
              value={formData.menu_favorit} 
              onChange={handleChange} 
              placeholder="Contoh: Kue Lapis Legit" 
            />
          </div>

          {/* Deskripsi */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deskripsi Toko
            </label>
            <textarea 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none resize-none" 
              name="deskripsi" 
              value={formData.deskripsi} 
              onChange={handleChange} 
              placeholder="Ceritakan tentang toko Anda..."
              rows="3"
            />
          </div>

          {/* Gambar Toko */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama File Gambar Toko
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="gambar" 
              value={formData.gambar} 
              onChange={handleChange} 
              placeholder="contoh: toko-mawar.jpg" 
            />
            <p className="text-xs text-slate-500 mt-1">Upload gambar ke folder /public/images/</p>
          </div>

          {/* Gambar Menu */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama File Gambar Menu
            </label>
            <input 
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none" 
              name="gambarmenu" 
              value={formData.gambarmenu} 
              onChange={handleChange} 
              placeholder="contoh: menu-mawar.jpg"/>
<p className="text-xs text-slate-500 mt-1">Upload gambar ke folder /public/images/</p>
</div>
{/* Action Buttons */}
      <div className="md:col-span-2 flex gap-3 mt-4">
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-semibold"
        >
          Batal
        </button>
        <button 
          type="submit" 
          disabled={isLoading} 
          className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} /> 
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  </div>
</div>
);
}