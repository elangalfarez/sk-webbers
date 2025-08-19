// src/components/admin/AdminLayout.tsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Gift, 
  Store, 
  Map, 
  UtensilsCrossed, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  Eye,
  User,
  Shield
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  permission?: string
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { adminUser, signOut, hasPermission } = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigationSections: NavSection[] = [
    {
      title: 'Analytics',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, permission: 'view_dashboard' },
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, permission: 'view_analytics' },
        { label: 'Activity Logs', href: '/admin/logs', icon: Eye, permission: 'view_logs' }
      ]
    },
    {
      title: 'Content Management',
      items: [
        { label: 'Blog Posts', href: '/admin/blogs', icon: FileText, permission: 'create_blog' },
        { label: 'Events', href: '/admin/events', icon: Calendar, permission: 'create_event' },
        { label: 'Promotions', href: '/admin/promotions', icon: Gift, permission: 'create_promotion' }
      ]
    },
    {
      title: 'Mall Management',
      items: [
        { label: 'Tenants', href: '/admin/tenants', icon: Store, permission: 'manage_tenants' },
        { label: 'Floor Plan', href: '/admin/floor-plan', icon: Map, permission: 'edit_floor_plan' },
        { label: 'Food Court', href: '/admin/food-court', icon: UtensilsCrossed, permission: 'manage_tenants' }
      ]
    },
    {
      title: 'Administration',
      items: [
        { label: 'Users', href: '/admin/users', icon: Users, permission: 'manage_users' },
        { label: 'Settings', href: '/admin/settings', icon: Settings, permission: 'manage_users' }
      ]
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800'
      case 'content_manager': return 'bg-blue-100 text-blue-800'
      case 'marketing': return 'bg-green-100 text-green-800'
      case 'operations': return 'bg-yellow-100 text-yellow-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-primary transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gold/20">
            <div className="flex items-center">
              <img
                src="https://supermalkarawaci.co.id/core/wp-content/uploads/2025/07/LOGO-SK-Tulisan-Putih-scaled.png"
                alt="Supermal Karawaci"
                className="h-12 w-auto mr-3"
              />
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-gold text-sm">Supermal Karawaci</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gold"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Admin User Info */}
          <div className="p-6 border-b border-gold/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {adminUser?.full_name}
                </p>
                <p className="text-blue-200 text-sm truncate">
                  {adminUser?.email}
                </p>
                <Badge 
                  className={cn(
                    "mt-1 text-xs",
                    getRoleBadgeColor(adminUser?.role || '')
                  )}
                >
                  {formatRoleName(adminUser?.role || '')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-xs font-semibold text-gold uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    if (item.permission && !hasPermission(item.permission)) {
                      return null
                    }

                    const isActive = location.pathname === item.href
                    const Icon = item.icon

                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={cn(
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            isActive
                              ? "bg-gold/20 text-gold border-l-4 border-gold"
                              : "text-blue-200 hover:bg-white/5 hover:text-white"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                          {item.label}
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-gold/20">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-blue-200 hover:text-white hover:bg-white/5"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {adminUser?.full_name}
                </p>
                <p className="text-sm text-gray-500">
                  {adminUser?.department || 'Administrator'}
                </p>
              </div>
              <div className="w-8 h-8 bg-royal-purple rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout