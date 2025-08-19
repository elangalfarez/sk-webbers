// src/components/admin/PromotionEditor.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PromotionEditorProps {
  mode: 'create' | 'edit'
}

export const PromotionEditor: React.FC<PromotionEditorProps> = ({ mode }) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/promotions')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Promotions
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Promotion' : 'Edit Promotion'}
          </h1>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Under Development</h2>
        <p className="text-gray-600">
          Promotion editor will be implemented similar to blog and event editors.
        </p>
      </div>
    </div>
  )
}

// src/components/admin/Analytics.tsx
export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">View detailed performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mock Stats */}
        {[
          { label: 'Total Page Views', value: '234,567', change: '+12%' },
          { label: 'Unique Visitors', value: '45,234', change: '+8%' },
          { label: 'Avg. Session Duration', value: '4:32', change: '+15%' },
          { label: 'Bounce Rate', value: '23.4%', change: '-5%' }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics Coming Soon</h2>
        <p className="text-gray-600">
          Detailed charts, visitor flows, and comprehensive reporting will be implemented here.
        </p>
      </div>
    </div>
  )
}

// src/components/admin/UserManagement.tsx
export const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage admin users and permissions</p>
        </div>
        <Button>
          <span className="mr-2">+</span>
          Add New User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
        </div>
        
        <div className="p-8 text-center">
          <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management Interface</h3>
          <p className="text-gray-600 mb-4">
            This will include user creation, role assignment, and permission management.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-semibold text-blue-900 mb-2">Features to implement:</h4>
            <ul className="text-blue-800 text-sm space-y-1 text-left">
              <li>• Create/edit admin users</li>
              <li>• Role-based permissions</li>
              <li>• Activity monitoring</li>
              <li>• Account activation/deactivation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// src/components/admin/ActivityLogs.tsx
export const ActivityLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600 mt-1">View system activity and user actions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="p-8 text-center">
          <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Activity Logs Interface</h3>
          <p className="text-gray-600 mb-4">
            Comprehensive logging of all admin actions and system events.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-semibold text-purple-900 mb-2">Planned features:</h4>
            <ul className="text-purple-800 text-sm space-y-1 text-left">
              <li>• User login/logout tracking</li>
              <li>• Content creation/modification logs</li>
              <li>• System configuration changes</li>
              <li>• Advanced filtering and search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// src/components/admin/Settings.tsx
export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Title
              </label>
              <input
                type="text"
                defaultValue="Supermal Karawaci Admin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                defaultValue="admin@supermalkarawaci.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strapi URL
              </label>
              <input
                type="url"
                defaultValue="http://localhost:1337"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://your-project.supabase.co"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Advanced Settings</h2>
        <p className="text-gray-600">
          Additional configuration options will be available here.
        </p>
      </div>
    </div>
  )
}