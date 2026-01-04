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
 * Tambah log aktivitas
 */
export const addLog = async (logData) => {
  try {
    const { data, error } = await supabase
      .from('log_history')
      .insert([{
        user_email: logData.userEmail,
        action: logData.action,
        toko_name: logData.tokoName,
        timestamp: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
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

export default supabase