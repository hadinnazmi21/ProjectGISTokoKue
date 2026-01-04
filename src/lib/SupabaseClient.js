// src/lib/SupabaseClient.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials! Check your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ==================== AUTH FUNCTIONS (Custom Table) ====================

/**
 * Login user dengan tabel users custom
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()
    
    if (error) throw new Error('Email atau password salah')
    if (!data) throw new Error('User tidak ditemukan')
    
    return { 
      success: true, 
      user: {
        user_id: data.user_id,
        email: data.email,
        role: data.role,
        nama_lengkap: data.nama_lengkap
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Logout user
 */
export const logoutUser = async () => {
  return { success: true }
}

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get user by Email
 */
export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update user profile (nama_lengkap)
 */
export const updateUserProfile = async (userId, namaLengkap) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ nama_lengkap: namaLengkap })
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Change user password
 */
export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    // 1. Verifikasi password lama
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (fetchError) throw new Error('User tidak ditemukan')
    
    // 2. Cek password lama
    if (user.password !== currentPassword) {
      throw new Error('Password saat ini salah')
    }
    
    // 3. Update password baru
    const { data, error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== TOKO KUE CRUD FUNCTIONS ====================

/**
 * GET: Ambil semua toko (untuk ADMIN)
 */
export const getAllToko = async () => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * GET: Ambil toko milik owner tertentu (untuk OWNER)
 */
export const getTokoByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: true })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * GET: Ambil 1 toko berdasarkan ID
 */
export const getTokoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * POST: Tambah toko baru
 */
export const addToko = async (tokoData) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .insert([tokoData])
      .select()
    
    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * PUT: Update toko
 */
export const updateToko = async (id, tokoData) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .update(tokoData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * DELETE: Hapus toko
 */
export const deleteToko = async (id) => {
  try {
    const { error } = await supabase
      .from('toko_kue')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== TOKO REQUEST FUNCTIONS ====================

/**
 * CREATE: Owner submit request toko baru
 */
export const createTokoRequest = async (requestData) => {
  try {
    console.log('📝 Creating request with data:', requestData);
    
    const requestPayload = {
      user_id: requestData.user_id,
      nama: requestData.nama,
      lat: requestData.lat,
      lng: requestData.lng,
      kecamatan: requestData.kecamatan || null,
      kelurahan: requestData.kelurahan || null,
      jalan: requestData.jalan || requestData.alamat || null,
      produk: requestData.produk,
      jam_buka: requestData.jam_buka || null,
      tahun_berdiri: requestData.tahun_berdiri || null,
      telp: requestData.telp || requestData.no_telp || null,
      menu_favorit: requestData.menu_favorit || null,
      deskripsi: requestData.deskripsi || null,
      gambar: requestData.gambar || requestData.gambar_toko || null,
      gambarmenu: requestData.gambarmenu || requestData.gambar_menu || null,
      status: 'pending'
    }

    console.log('📦 Request payload:', requestPayload);

    const { data, error } = await supabase
      .from('toko_requests')
      .insert([requestPayload])
      .select()
    
    if (error) {
      console.error('❌ Insert error:', error);
      throw error;
    }
    
    console.log('✅ Request created:', data);
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('❌ Create request failed:', error);
    return { success: false, error: error.message }
  }
}

/**
 * GET: Ambil semua request (untuk Admin)
 */
export const getAllRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('toko_requests')
      .select(`
        *,
        users (
          email,
          nama_lengkap,
          role
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * GET: Ambil request milik owner tertentu
 */
export const getRequestsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('toko_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * UPDATE: Admin approve request
 */
export const approveRequest = async (requestId, adminNote = '') => {
  try {
    console.log('=== APPROVE REQUEST START ===');
    console.log('Request ID:', requestId);
    console.log('Admin Note:', adminNote);

    // 1. Ambil data request
    const { data: request, error: fetchError } = await supabase
      .from('toko_requests')
      .select('*')
      .eq('id', requestId)
      .single()
    
    if (fetchError) {
      console.error('❌ Error fetching request:', fetchError);
      throw new Error(`Gagal mengambil data request: ${fetchError.message}`);
    }

    if (!request) {
      throw new Error('Request tidak ditemukan');
    }

    console.log('✅ Request data:', JSON.stringify(request, null, 2));

    // 2. Validasi data required
    if (!request.user_id || !request.nama || !request.lat || !request.lng) {
      throw new Error('Data required tidak lengkap (user_id, nama, lat, lng)');
    }

    // 3. Prepare payload
    const tokoPayload = {
      user_id: request.user_id,
      nama: request.nama,
      lat: request.lat ? parseFloat(request.lat) : null,
      lng: request.lng ? parseFloat(request.lng) : null,
      kecamatan: request.kecamatan || null,
      kelurahan: request.kelurahan || null,
      jalan: request.jalan || request.alamat || null,
      produk: request.produk || 'Kue',
      jam_buka: request.jam_buka || null,
      telp: request.telp || request.no_telp || null,
      menu_favorit: request.menu_favorit || null,
      deskripsi: request.deskripsi || null,
      gambar: request.gambar || request.gambar_toko || null,
      gambarmenu: request.gambarmenu || request.gambar_menu || null,
      rating: null
    };

    // Handle tahun_berdiri
    if (request.tahun_berdiri) {
      const tahun = parseInt(request.tahun_berdiri);
      tokoPayload.tahun_berdiri = isNaN(tahun) ? null : tahun;
    } else {
      tokoPayload.tahun_berdiri = null;
    }

    console.log('📦 Toko payload:', JSON.stringify(tokoPayload, null, 2));

    // 4. Insert ke toko_kue
    console.log('💾 Attempting to insert into toko_kue...');
    const { data: newToko, error: insertError } = await supabase
      .from('toko_kue')
      .insert([tokoPayload])
      .select()
    
    if (insertError) {
      console.error('❌ INSERT FAILED!');
      console.error('❌ Error:', JSON.stringify(insertError, null, 2));
      
      if (insertError.code === '23503') {
        throw new Error(`Foreign key constraint failed. User ID ${request.user_id} mungkin tidak ada di tabel users.`);
      } else if (insertError.code === '23502') {
        throw new Error(`Field required kosong: ${insertError.message}`);
      } else if (insertError.code === '42703') {
        throw new Error(`Kolom tidak ditemukan: ${insertError.message}`);
      } else {
        throw new Error(`Database error: ${insertError.message} (Code: ${insertError.code})`);
      }
    }

    if (!newToko || newToko.length === 0) {
      throw new Error('Insert berhasil tapi tidak mengembalikan data');
    }

    console.log('✅ Toko berhasil ditambahkan!');
    console.log('✅ New toko data:', JSON.stringify(newToko[0], null, 2));

    // 5. Update status request
    console.log('📝 Updating request status...');
    const { error: updateError } = await supabase
      .from('toko_requests')
      .update({
        status: 'approved',
        admin_note: adminNote || null
      })
      .eq('id', requestId)
    
    if (updateError) {
      console.error('⚠️ Warning - Error updating request status:', updateError);
    } else {
      console.log('✅ Request status updated to approved');
    }

    console.log('=== APPROVE REQUEST SUCCESS ===');
    return { success: true, data: newToko[0] };

  } catch (error) {
    console.error('=== APPROVE REQUEST FAILED ===');
    console.error('❌ Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * UPDATE: Admin reject request
 */
export const rejectRequest = async (requestId, adminNote = '') => {
  try {
    console.log('=== REJECT REQUEST START ===');
    console.log('Request ID:', requestId);
    console.log('Admin Note:', adminNote);

    const { error } = await supabase
      .from('toko_requests')
      .update({
        status: 'rejected',
        admin_note: adminNote || null
      })
      .eq('id', requestId)
    
    if (error) {
      console.error('❌ Error rejecting request:', error);
      throw error;
    }

    console.log('✅ Request rejected successfully');
    console.log('=== REJECT REQUEST SUCCESS ===');
    return { success: true };

  } catch (error) {
    console.error('=== REJECT REQUEST FAILED ===');
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * DELETE: Hapus request
 */
export const deleteRequest = async (requestId) => {
  try {
    const { error } = await supabase
      .from('toko_requests')
      .delete()
      .eq('id', requestId)
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== UPLOAD IMAGE FUNCTIONS ====================

/**
 * Upload gambar toko ke Supabase Storage
 */
export const uploadTokoImage = async (file, tokoId) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `toko_${tokoId}_${Date.now()}.${fileExt}`
    const filePath = `toko-images/${fileName}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return { success: true, url: publicUrl, path: filePath }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete image dari storage
 */
export const deleteTokoImage = async (imagePath) => {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([imagePath])

    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== SEARCH & FILTER FUNCTIONS ====================

/**
 * Search toko berdasarkan nama
 */
export const searchToko = async (query) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .ilike('nama', `%${query}%`)
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Filter toko berdasarkan kecamatan
 */
export const filterByKecamatan = async (kecamatan) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .eq('kecamatan', kecamatan)
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Filter toko berdasarkan produk
 */
export const filterByProduk = async (produk) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .eq('produk', produk)
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ==================== LOG HISTORY FUNCTIONS ====================

/**
 * ✅ FIXED: Tambah log aktivitas
 */
export const addLog = async (logData) => {
  try {
    const logPayload = {
      user_email: logData.userEmail,
      user_role: logData.userRole || null,
      action: logData.action,
      toko_id: logData.tokoId || null,
      toko_name: logData.tokoName || null,
      description: logData.description || null,
      timestamp: new Date().toISOString()
    };

    console.log('📝 Adding log:', logPayload);

    const { data, error } = await supabase
      .from('log_history')
      .insert([logPayload])
      .select()
    
    if (error) {
      console.error('❌ Error adding log:', error);
      throw error;
    }
    
    console.log('✅ Log added successfully:', data);
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('❌ Failed to add log:', error);
    return { success: false, error: error.message }
  }
}

/**
 * GET: Ambil semua log history
 */
export const getAllLogs = async () => {
  try {
    const { data, error } = await supabase
      .from('log_history')
      .select('*')
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * GET: Ambil log berdasarkan user email
 */
export const getLogsByUserEmail = async (userEmail) => {
  try {
    const { data, error } = await supabase
      .from('log_history')
      .select('*')
      .eq('user_email', userEmail)
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default supabase