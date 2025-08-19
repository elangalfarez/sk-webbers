// src/components/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react'
import { 
  FileText, 
  Calendar, 
  Gift, 
  TrendingUp, 
  Users, 
  Eye,
  Plus,
  ArrowUpRight,
  Activity,
  Clock
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { strapiService } from '@/lib/strapi'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, formatDistanceToNow } from 'date-fns'

interface DashboardStats {
  totalBlogs: number
  totalEvents: number
  totalPromotions: number
  recentViews: number
}

interface RecentActivity {
  id: string
  action: string
  resource_type: string | null
  resource_id: string | null
  admin_user_name: string
  created_at: string
  details: any
}

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ElementType
  color: string
  permission: string
}

const Dashboard: React.FC = () => {
  const { adminUser, hasPermission } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    totalEvents: 0,
    totalPromotions: 0,
    recentViews: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  const quickActions: QuickAction[] = [
    {
      title: 'Create Blog Post',
      description: 'Share news and updates',
      href: '/admin/blogs/new',
      icon: FileText,
      color: 'bg-blue-500',
      permission: 'create_blog'
    },
    {
      title: 'Schedule Event',
      description: 'Create new mall event',
      href: '/admin/events/new',
      icon: Calendar,
      color: 'bg-green-500',
      permission: 'create_event'
    },
    {
      title: 'New Promotion',
      description: 'Launch special offers',
      href: '/admin/promotions/new',
      icon: Gift,
      color: 'bg-purple-500',
      permission: 'create_promotion'
    },
    {
      title: 'View Analytics',
      description: 'Performance insights',
      href: '/admin/analytics',
      icon: TrendingUp,
      color: 'bg-orange-500',
      permission: 'view_analytics'
    }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load content stats from Strapi
      const [blogsResponse, eventsResponse, promotionsResponse] = await Promise.all([
        strapiService.getBlogs({ 'pagination[limit]': 1 }),
        strapiService.getEvents({ 'pagination[limit]': 1 }),
        strapiService.getPromotions({ 'pagination[limit]': 1 })
      ])

      setStats({
        totalBlogs: blogsResponse.meta?.pagination?.total || 0,
        totalEvents: eventsResponse.meta?.pagination?.total || 0,
        totalPromotions: promotionsResponse.meta?.pagination?.total || 0,
        recentViews: Math.floor(Math.random() * 10000) // Mock data for now
      })

      // Load recent activity from Supabase
      const { data: activityData } = await supabase
        .from('admin_activity_logs')
        .select(`
          *,
          admin_users!admin_activity_logs_admin_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (activityData) {
        setRecentActivity(activityData.map(item => ({
          ...item,
          admin_user_name: item.admin_users?.full_name || 'Unknown User'
        })))
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'login': return '🔐'
      case 'logout': return '👋'
      case 'create_blog': return '📝'
      case 'edit_blog': return '✏️'
      case 'delete_blog': return '🗑️'
      case 'create_event': return '🎉'
      case 'edit_event': return '📅'
      case 'create_promotion': return '🎁'
      default: return '📋'
    }
  }

  const getActivityDescription = (activity: RecentActivity) => {
    switch (activity.action) {
      case 'login':
        return 'Logged into admin panel'
      case 'logout':
        return 'Logged out of admin panel'
      case 'create_blog':
        return `Created blog post: ${activity.details?.title || 'Untitled'}`
      case 'edit_blog':
        return `Updated blog post: ${activity.details?.title || 'Untitled'}`
      case 'delete_blog':
        return 'Deleted a blog post'
      case 'create_event':
        return `Created event: ${activity.details?.title || 'Untitled'}`
      case 'edit_event':
        return `Updated event: ${activity.details?.title || 'Untitled'}`
      case 'create_promotion':
        return `Created promotion: ${activity.details?.title || 'Untitled'}`
      default:
        return activity.action.replace(/_/g, ' ')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {adminUser?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening at Supermal Karawaci today
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Badge variant="outline" className="text-green-700 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blog Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">8% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Promotions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPromotions}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">23% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Views</p>
              <p className="text-3xl font-bold text-gray-900">{stats.recentViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">15% from last month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions
            .filter(action => hasPermission(action.permission))
            .map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  to={action.href}
                  className="p-4 border border-gray-200 rounded-lg hover:border-royal-purple hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-royal-purple">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          {hasPermission('view_logs') && (
            <Link to="/admin/logs">
              <Button variant="outline" size="sm">
                View All Logs
              </Button>
            </Link>
          )}
        </div>
        
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            recentActivity.slice(0, 8).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="text-lg">{getActivityIcon(activity.action)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.admin_user_name}</span> {getActivityDescription(activity)}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard