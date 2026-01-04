// src/components/dashboard/TokoForm.jsx
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 flex justify-between">
          <h2 className="text-xl font-bold text-white">
            {toko ? 'Edit Toko' : 'Tambah Toko'}
          </h2>
          <button onClick={onCancel}>
            <X className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input md:col-span-2" name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama Toko" required />
          <input className="input" name="lat" value={formData.lat} onChange={handleChange} placeholder="Latitude" required />
          <input className="input" name="lng" value={formData.lng} onChange={handleChange} placeholder="Longitude" required />
          <input className="input" name="kecamatan" value={formData.kecamatan} onChange={handleChange} placeholder="Kecamatan" />
          <input className="input" name="kelurahan" value={formData.kelurahan} onChange={handleChange} placeholder="Kelurahan" />
          <input className="input md:col-span-2" name="jalan" value={formData.jalan} onChange={handleChange} placeholder="Alamat Jalan" />

          <select className="input" name="produk" value={formData.produk} onChange={handleChange}>
            <option value="Kue">Kue</option>
            <option value="Brownies">Brownies</option>
          </select>

          <input className="input" name="jam_buka" value={formData.jam_buka} onChange={handleChange} placeholder="Jam Buka" />
          <input className="input" name="tahun_berdiri" value={formData.tahun_berdiri} onChange={handleChange} />
          <input className="input" name="rating" value={formData.rating} onChange={handleChange} />

          <input className="input" name="telp" value={formData.telp} onChange={handleChange} placeholder="No Telp" />
          <input className="input" name="menu_favorit" value={formData.menu_favorit} onChange={handleChange} placeholder="Menu Favorit" />

          <textarea className="input md:col-span-2" name="deskripsi" value={formData.deskripsi} onChange={handleChange} placeholder="Deskripsi Toko" />

          <input className="input" name="gambar" value={formData.gambar} onChange={handleChange} placeholder="gambar toko.jpg" />
          <input className="input" name="gambarmenu" value={formData.gambarmenu} onChange={handleChange} placeholder="gambar menu.jpg" />

          <div className="md:col-span-2 flex gap-3">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex justify-center gap-2">
              <Save size={18} /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
