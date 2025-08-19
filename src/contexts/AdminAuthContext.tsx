// src/contexts/AdminAuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { AdminUser, adminAuth, supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface AdminAuthContextType {
  user: User | null
  adminUser: AdminUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkPermission: (permission: string) => Promise<boolean>
  hasPermission: (permission: string) => boolean
  logActivity: (action: string, resourceType?: string, resourceId?: string, details?: any) => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadAdminUser(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadAdminUser(session.user.id)
        } else {
          setAdminUser(null)
          setPermissions([])
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadAdminUser = async (userId: string) => {
    try {
      const { data: adminUserData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', userId)
        .eq('is_active', true)
        .single()

      if (error || !adminUserData) {
        // User exists in auth but not in admin_users or is inactive
        await supabase.auth.signOut()
        toast.error('Access denied: Not authorized as admin')
        return
      }

      setAdminUser(adminUserData)
      await loadPermissions(adminUserData.role)
    } catch (error) {
      console.error('Error loading admin user:', error)
      await supabase.auth.signOut()
      toast.error('Error loading user data')
    } finally {
      setLoading(false)
    }
  }

  const loadPermissions = async (role: string) => {
    try {
      const { data: permissionsData } = await supabase
        .from('admin_permissions')
        .select('permission')
        .eq('role', role)

      if (permissionsData) {
        setPermissions(permissionsData.map(p => p.permission))
      }
    } catch (error) {
      console.error('Error loading permissions:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { user: authUser, adminUser: adminUserData } = await adminAuth.signIn(email, password)
      setUser(authUser)
      setAdminUser(adminUserData)
      await loadPermissions(adminUserData.role)
      toast.success(`Welcome back, ${adminUserData.full_name}!`)
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await adminAuth.logActivity('logout')
      await adminAuth.signOut()
      setUser(null)
      setAdminUser(null)
      setPermissions([])
      toast.success('Signed out successfully')
    } catch (error: any) {
      toast.error(error.message || 'Logout failed')
    }
  }

  const checkPermission = async (permission: string): Promise<boolean> => {
    return adminAuth.checkPermission(permission)
  }

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission) || adminUser?.role === 'super_admin'
  }

  const logActivity = async (
    action: string, 
    resourceType?: string, 
    resourceId?: string, 
    details?: any
  ) => {
    await adminAuth.logActivity(action, resourceType, resourceId, details)
  }

  const value = {
    user,
    adminUser,
    loading,
    signIn,
    signOut,
    checkPermission,
    hasPermission,
    logActivity
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}