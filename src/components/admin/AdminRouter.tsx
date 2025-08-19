// src/components/admin/AdminRouter.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from './AdminLayout'
import AdminLogin from './AdminLogin'
import Dashboard from './Dashboard'
import BlogManagement from './BlogManagement'
import BlogEditor from './BlogEditor'
import EventManagement from './EventManagement'
import EventEditor from './EventEditor'
import PromotionManagement from './PromotionManagement'
import PromotionEditor from './PromotionEditor'
import Analytics from './Analytics'
import UserManagement from './UserManagement'
import ActivityLogs from './ActivityLogs'
import Settings from './Settings'

const AdminRouter: React.FC = () => {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen">
        <Routes>
          {/* Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    {/* Dashboard */}
                    <Route 
                      index 
                      element={
                        <ProtectedRoute permission="view_dashboard">
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Analytics */}
                    <Route 
                      path="analytics" 
                      element={
                        <ProtectedRoute permission="view_analytics">
                          <Analytics />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Activity Logs */}
                    <Route 
                      path="logs" 
                      element={
                        <ProtectedRoute permission="view_logs">
                          <ActivityLogs />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Blog Management */}
                    <Route 
                      path="blogs" 
                      element={
                        <ProtectedRoute permission="create_blog">
                          <BlogManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="blogs/new" 
                      element={
                        <ProtectedRoute permission="create_blog">
                          <BlogEditor mode="create" />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="blogs/:id/edit" 
                      element={
                        <ProtectedRoute permission="edit_blog">
                          <BlogEditor mode="edit" />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Event Management */}
                    <Route 
                      path="events" 
                      element={
                        <ProtectedRoute permission="create_event">
                          <EventManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="events/new" 
                      element={
                        <ProtectedRoute permission="create_event">
                          <EventEditor mode="create" />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="events/:id/edit" 
                      element={
                        <ProtectedRoute permission="edit_event">
                          <EventEditor mode="edit" />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Promotion Management */}
                    <Route 
                      path="promotions" 
                      element={
                        <ProtectedRoute permission="create_promotion">
                          <PromotionManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="promotions/new" 
                      element={
                        <ProtectedRoute permission="create_promotion">
                          <PromotionEditor mode="create" />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="promotions/:id/edit" 
                      element={
                        <ProtectedRoute permission="edit_promotion">
                          <PromotionEditor mode="edit" />
                        </ProtectedRoute>
                      } 
                    />

                    {/* User Management */}
                    <Route 
                      path="users" 
                      element={
                        <ProtectedRoute permission="manage_users">
                          <UserManagement />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Settings */}
                    <Route 
                      path="settings" 
                      element={
                        <ProtectedRoute permission="manage_users">
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Tenant Management - Future Implementation */}
                    <Route 
                      path="tenants" 
                      element={
                        <ProtectedRoute permission="manage_tenants">
                          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tenant Management</h2>
                            <p className="text-gray-600 mb-4">
                              This feature will integrate with your existing Supabase tenant data.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h3 className="font-semibold text-blue-900 mb-2">Coming Soon:</h3>
                              <ul className="text-blue-800 text-sm space-y-1">
                                <li>• Visual floor plan editor</li>
                                <li>• SVG path mapping integration</li>
                                <li>• Tenant information management</li>
                                <li>• Interactive directory updates</li>
                              </ul>
                            </div>
                          </div>
                        </ProtectedRoute>
                      } 
                    />

                    {/* Floor Plan - Future Implementation */}
                    <Route 
                      path="floor-plan" 
                      element={
                        <ProtectedRoute permission="edit_floor_plan">
                          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Floor Plan Editor</h2>
                            <p className="text-gray-600 mb-4">
                              Interactive floor plan editor for managing tenant locations and SVG paths.
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h3 className="font-semibold text-green-900 mb-2">Planned Features:</h3>
                              <ul className="text-green-800 text-sm space-y-1">
                                <li>• Drag & drop tenant positioning</li>
                                <li>• Real-time SVG path generation</li>
                                <li>• Multi-floor support</li>
                                <li>• Responsive design preview</li>
                              </ul>
                            </div>
                          </div>
                        </ProtectedRoute>
                      } 
                    />

                    {/* Food Court - Future Implementation */}
                    <Route 
                      path="food-court" 
                      element={
                        <ProtectedRoute permission="manage_tenants">
                          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Food Court Management</h2>
                            <p className="text-gray-600 mb-4">
                              Manage food court tenants, menus, and dining information.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <h3 className="font-semibold text-yellow-900 mb-2">Future Implementation:</h3>
                              <ul className="text-yellow-800 text-sm space-y-1">
                                <li>• Restaurant menu management</li>
                                <li>• Operating hours coordination</li>
                                <li>• Special dietary options tracking</li>
                                <li>• Customer review integration</li>
                              </ul>
                            </div>
                          </div>
                        </ProtectedRoute>
                      } 
                    />

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root admin to dashboard */}
          <Route path="/admin" element={<Navigate to="/admin" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#121421',
              color: '#ffffff',
              border: '1px solid #D4AF37',
            },
            success: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#121421',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </AdminAuthProvider>
  )
}

export default AdminRouter