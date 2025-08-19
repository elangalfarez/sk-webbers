// src/components/admin/PromotionManagement.tsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Percent,
  Store,
  Star,
  Gift
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { strapiService, Promotion } from '@/lib/strapi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, isPast, isFuture } from 'date-fns'
import toast from 'react-hot-toast'

interface PromotionListItem extends Promotion {
  id: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}

const PromotionManagement: React.FC = () => {
  const { hasPermission, logActivity } = useAdminAuth()
  const [promotions, setPromotions] = useState<PromotionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    'Fashion',
    'Food & Beverage',
    'Electronics',
    'Beauty & Health',
    'Entertainment',
    'Mall-wide',
    'Seasonal'
  ]

  useEffect(() => {
    loadPromotions()
  }, [currentPage, searchTerm, selectedCategory])

  const loadPromotions = async () => {
    try {
      setLoading(true)
      
      const params: Record<string, any> = {
        'pagination[page]': currentPage,
        'pagination[pageSize]': 10,
        populate: 'featured_image',
        sort: 'priority:desc,createdAt:desc'
      }

      if (searchTerm) {
        params['filters[title][$containsi]'] = searchTerm
      }

      if (selectedCategory) {
        params['filters[category][$eq]'] = selectedCategory
      }

      const response = await strapiService.getPromotions(params)
      
      if (response.data) {
        setPromotions(response.data as PromotionListItem[])
        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.pageCount)
        }
      }
    } catch (error) {
      console.error('Error loading promotions:', error)
      toast.error('Failed to load promotions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!hasPermission('delete_promotion')) {
      toast.error('You do not have permission to delete promotions')
      return
    }

    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      await strapiService.deletePromotion(id)
      await logActivity('delete_promotion', 'promotion', id.toString(), { title })
      setPromotions(promotions.filter(promotion => promotion.id !== id))
      toast.success('Promotion deleted successfully')
    } catch (error) {
      console.error('Error deleting promotion:', error)
      toast.error('Failed to delete promotion')
    }
  }

  const getStatusColor = (isActive: boolean, validFrom: string, validUntil: string) => {
    const now = new Date()
    const start = new Date(validFrom)
    const end = new Date(validUntil)

    if (!isActive) {
      return 'bg-gray-100 text-gray-800'
    }

    if (isPast(end)) {
      return 'bg-red-100 text-red-800'
    }

    if (isFuture(start)) {
      return 'bg-blue-100 text-blue-800'
    }

    if (now >= start && now <= end) {
      return 'bg-green-100 text-green-800'
    }

    return 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (isActive: boolean, validFrom: string, validUntil: string) => {
    const now = new Date()
    const start = new Date(validFrom)
    const end = new Date(validUntil)

    if (!isActive) return 'Inactive'
    if (isPast(end)) return 'Expired'
    if (isFuture(start)) return 'Scheduled'
    if (now >= start && now <= end) return 'Active'
    return 'Unknown'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Fashion': 'bg-purple-100 text-purple-800',
      'Food & Beverage': 'bg-orange-100 text-orange-800',
      'Electronics': 'bg-blue-100 text-blue-800',
      'Beauty & Health': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-green-100 text-green-800',
      'Mall-wide': 'bg-gold/20 text-yellow-800',
      'Seasonal': 'bg-red-100 text-red-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getImageUrl = (image: any) => {
    if (!image) return null
    const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
    return `${baseUrl}${image.url}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotion Management</h1>
          <p className="text-gray-600 mt-1">Create and manage promotional offers</p>
        </div>
        {hasPermission('create_promotion') && (
          <Link to="/admin/promotions/new">
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              New Promotion
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search promotions..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="p-12 text-center">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first promotion'
              }
            </p>
            {hasPermission('create_promotion') && !searchTerm && !selectedCategory && (
              <Link to="/admin/promotions/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Promotion
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Featured Image */}
                  <div className="flex-shrink-0">
                    {promotion.featured_image ? (
                      <img
                        src={getImageUrl(promotion.featured_image)}
                        alt={promotion.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Gift className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {promotion.title}
                          </h3>
                          {promotion.is_featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <Badge className={getStatusColor(
                            promotion.is_active || false, 
                            promotion.valid_from, 
                            promotion.valid_until
                          )}>
                            {getStatusText(
                              promotion.is_active || false, 
                              promotion.valid_from, 
                              promotion.valid_until
                            )}
                          </Badge>
                          
                          <Badge className={getCategoryColor(promotion.category)}>
                            {promotion.category}
                          </Badge>

                          {promotion.discount_percentage && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Percent className="w-3 h-3 mr-1" />
                              {promotion.discount_percentage}% OFF
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-royal-purple" />
                            <div>
                              <div>From: {format(new Date(promotion.valid_from), 'MMM dd, yyyy')}</div>
                              <div>To: {format(new Date(promotion.valid_until), 'MMM dd, yyyy')}</div>
                            </div>
                          </div>
                          
                          {promotion.tenant_name && (
                            <div className="flex items-center">
                              <Store className="w-4 h-4 mr-2 text-royal-purple" />
                              <span>{promotion.tenant_name}</span>
                            </div>
                          )}

                          {promotion.promo_code && (
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-xs">
                                Code: {promotion.promo_code}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link to={`/admin/promotions/${promotion.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        {hasPermission('edit_promotion') && (
                          <Link to={`/admin/promotions/${promotion.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}

                        {hasPermission('delete_promotion') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(promotion.id, promotion.title)}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PromotionManagement