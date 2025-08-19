// src/components/admin/ProtectedRoute.tsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Shield, AlertTriangle } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: string
  fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  permission,
  fallback 
}) => {
  const { user, adminUser, loading, hasPermission } = useAdminAuth()
  const location = useLocation()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user || !adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if user account is active
  if (!adminUser.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Deactivated</h2>
          <p className="text-gray-600 mb-6">
            Your admin account has been deactivated. Please contact the system administrator for assistance.
          </p>
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  // Check specific permission if required
  if (permission && !hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Contact your administrator if you think this is an error.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Required permission: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{permission}</code>
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute