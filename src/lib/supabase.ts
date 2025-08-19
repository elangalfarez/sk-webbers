// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface AdminUser {
  id: string
  auth_user_id: string | null
  email: string
  full_name: string
  role: 'super_admin' | 'content_manager' | 'marketing' | 'operations' | 'viewer'
  department: string | null
  avatar_url: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  last_login_at: string | null
  created_by: string | null
}

export interface AdminSession {
  id: string
  admin_user_id: string
  session_token: string
  ip_address: string | null
  user_agent: string | null
  expires_at: string
  created_at: string
  is_active: boolean
}

export interface AdminActivityLog {
  id: string
  admin_user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  details: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AdminPermission {
  id: string
  role: string
  permission: string
  created_at: string
}

// Auth helper functions
export const adminAuth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // Get admin user data
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', data.user.id)
      .eq('is_active', true)
      .single()
    
    if (adminError || !adminUser) {
      throw new Error('User is not authorized as admin')
    }
    
    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminUser.id)
    
    // Log activity
    await adminAuth.logActivity('login', null, null, {
      user_id: adminUser.id
    })
    
    return { user: data.user, adminUser }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentAdminUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single()
    
    return adminUser
  },

  async checkPermission(permission: string) {
    const adminUser = await this.getCurrentAdminUser()
    if (!adminUser) return false
    
    const { data } = await supabase.rpc('check_admin_permission', {
      user_id: adminUser.auth_user_id,
      required_permission: permission
    })
    
    return data || false
  },

  async logActivity(
    action: string, 
    resourceType: string | null = null, 
    resourceId: string | null = null, 
    details: any = {}
  ) {
    const adminUser = await this.getCurrentAdminUser()
    if (!adminUser) return
    
    await supabase.from('admin_activity_logs').insert({
      admin_user_id: adminUser.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: null, // Can be filled client-side if needed
      user_agent: navigator.userAgent
    })
  }
}