// src/components/admin/BlogManagement.tsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  FileText
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { strapiService, BlogPost } from '@/lib/strapi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface BlogListItem extends BlogPost {
  id: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}

const BlogManagement: React.FC = () => {
  const { hasPermission, logActivity } = useAdminAuth()
  const [blogs, setBlogs] = useState<BlogListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    'News',
    'Events',
    'Tenant Spotlight',
    'Shopping Tips',
    'Food & Dining',
    'Announcements',
    'Promotions',
    'Mall Updates'
  ]

  useEffect(() => {
    loadBlogs()
  }, [currentPage, searchTerm, selectedCategory])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      
      const params: Record<string, any> = {
        'pagination[page]': currentPage,
        'pagination[pageSize]': 10,
        populate: 'featured_image',
        sort: 'createdAt:desc'
      }

      if (searchTerm) {
        params['filters[title][$containsi]'] = searchTerm
      }

      if (selectedCategory) {
        params['filters[category][$eq]'] = selectedCategory
      }

      const response = await strapiService.getBlogs(params)
      
      if (response.data) {
        setBlogs(response.data as BlogListItem[])
        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.pageCount)
        }
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
      toast.error('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!hasPermission('delete_blog')) {
      toast.error('You do not have permission to delete blog posts')
      return
    }

    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      await strapiService.deleteBlog(id)
      await logActivity('delete_blog', 'blog', id.toString(), { title })
      setBlogs(blogs.filter(blog => blog.id !== id))
      toast.success('Blog post deleted successfully')
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog post')
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'News': 'bg-blue-100 text-blue-800',
      'Events': 'bg-green-100 text-green-800',
      'Tenant Spotlight': 'bg-purple-100 text-purple-800',
      'Shopping Tips': 'bg-yellow-100 text-yellow-800',
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Announcements': 'bg-red-100 text-red-800',
      'Promotions': 'bg-pink-100 text-pink-800',
      'Mall Updates': 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create and manage blog posts and articles</p>
        </div>
        {hasPermission('create_blog') && (
          <Link to="/admin/blogs/new">
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
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
                placeholder="Search blog posts..."
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

      {/* Blog List */}
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
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first blog post'
              }
            </p>
            {hasPermission('create_blog') && !searchTerm && !selectedCategory && (
              <Link to="/admin/blogs/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Blog Post
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Featured Image */}
                  <div className="flex-shrink-0">
                    {blog.featured_image ? (
                      <img
                        src={getImageUrl(blog.featured_image)}
                        alt={blog.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {blog.title}
                        </h3>
                        {blog.excerpt && (
                          <p className="text-gray-600 mt-1 line-clamp-2">
                            {blog.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge className={getCategoryColor(blog.category)}>
                            <Tag className="w-3 h-3 mr-1" />
                            {blog.category}
                          </Badge>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-4 h-4 mr-1" />
                            {blog.author}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {blog.publishedAt 
                              ? format(new Date(blog.publishedAt), 'MMM dd, yyyy')
                              : 'Draft'
                            }
                          </div>

                          {blog.is_featured && (
                            <Badge variant="secondary">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link to={`/admin/blogs/${blog.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        {hasPermission('edit_blog') && (
                          <Link to={`/admin/blogs/${blog.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}

                        {hasPermission('delete_blog') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(blog.id, blog.title)}
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

export default BlogManagement