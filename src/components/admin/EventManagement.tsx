// src/components/admin/EventManagement.tsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2, 
  Clock,
  Users,
  Star,
  Filter
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { strapiService, Event } from '@/lib/strapi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, isPast, isFuture } from 'date-fns'
import toast from 'react-hot-toast'

interface EventListItem extends Event {
  id: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}

const EventManagement: React.FC = () => {
  const { hasPermission, logActivity } = useAdminAuth()
  const [events, setEvents] = useState<EventListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    'Kids Entertainment',
    'Shopping',
    'Sale',
    'Fashion',
    'Food & Beverage',
    'Technology',
    'Culture',
    'Holiday Special'
  ]

  const statusOptions = [
    'upcoming',
    'active', 
    'completed',
    'cancelled'
  ]

  useEffect(() => {
    loadEvents()
  }, [currentPage, searchTerm, selectedCategory, selectedStatus])

  const loadEvents = async () => {
    try {
      setLoading(true)
      
      const params: Record<string, any> = {
        'pagination[page]': currentPage,
        'pagination[pageSize]': 10,
        populate: ['featured_image', 'gallery'],
        sort: 'start_date:desc'
      }

      if (searchTerm) {
        params['filters[title][$containsi]'] = searchTerm
      }

      if (selectedCategory) {
        params['filters[category][$eq]'] = selectedCategory
      }

      if (selectedStatus) {
        params['filters[status][$eq]'] = selectedStatus
      }

      const response = await strapiService.getEvents(params)
      
      if (response.data) {
        setEvents(response.data as EventListItem[])
        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.pageCount)
        }
      }
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!hasPermission('delete_event')) {
      toast.error('You do not have permission to delete events')
      return
    }

    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      await strapiService.deleteEvent(id)
      await logActivity('delete_event', 'event', id.toString(), { title })
      setEvents(events.filter(event => event.id !== id))
      toast.success('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  const getStatusColor = (status: string, startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (status === 'cancelled') {
      return 'bg-red-100 text-red-800'
    }

    if (isPast(end)) {
      return 'bg-gray-100 text-gray-800'
    }

    if (isFuture(start)) {
      return 'bg-blue-100 text-blue-800'
    }

    if (now >= start && now <= end) {
      return 'bg-green-100 text-green-800'
    }

    return 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string, startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (status === 'cancelled') return 'Cancelled'
    if (isPast(end)) return 'Completed'
    if (isFuture(start)) return 'Upcoming'
    if (now >= start && now <= end) return 'Active'
    return status
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Kids Entertainment': 'bg-pink-100 text-pink-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Sale': 'bg-red-100 text-red-800',
      'Fashion': 'bg-indigo-100 text-indigo-800',
      'Food & Beverage': 'bg-orange-100 text-orange-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Culture': 'bg-green-100 text-green-800',
      'Holiday Special': 'bg-yellow-100 text-yellow-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Schedule and manage mall events</p>
        </div>
        {hasPermission('create_event') && (
          <Link to="/admin/events/new">
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
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

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setSelectedStatus('')
              }}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory || selectedStatus 
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first event'
              }
            </p>
            {hasPermission('create_event') && !searchTerm && !selectedCategory && !selectedStatus && (
              <Link to="/admin/events/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Event
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Event Image */}
                  <div className="flex-shrink-0">
                    {event.featured_image ? (
                      <img
                        src={getImageUrl(event.featured_image)}
                        alt={event.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          {event.is_featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <Badge className={getStatusColor(event.status, event.start_date, event.end_date)}>
                            {getStatusText(event.status, event.start_date, event.end_date)}
                          </Badge>
                          
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-royal-purple" />
                            <div>
                              <div>Start: {format(new Date(event.start_date), 'MMM dd, yyyy')}</div>
                              <div>End: {format(new Date(event.end_date), 'MMM dd, yyyy')}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-royal-purple" />
                            <span>{event.location}</span>
                          </div>

                          {event.max_capacity && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-royal-purple" />
                              <span>Capacity: {event.max_capacity}</span>
                            </div>
                          )}
                        </div>

                        {event.registration_required && (
                          <div className="mt-2">
                            <Badge variant="outline">
                              Registration Required
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link to={`/admin/events/${event.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        {hasPermission('edit_event') && (
                          <Link to={`/admin/events/${event.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}

                        {hasPermission('delete_event') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(event.id, event.title)}
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

export default EventManagement