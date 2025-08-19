// src/components/admin/EventEditor.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Save, 
  Upload, 
  ArrowLeft, 
  Calendar,
  MapPin,
  Users,
  Star,
  Image as ImageIcon,
  X,
  Clock,
  Link as LinkIcon
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { strapiService, Event } from '@/lib/strapi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

// Form validation schema
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['upcoming', 'active', 'completed', 'cancelled']).default('upcoming'),
  is_featured: z.boolean().default(false),
  registration_required: z.boolean().default(false),
  registration_link: z.string().url().optional().or(z.literal('')),
  max_capacity: z.number().min(1).optional()
}).refine((data) => {
  const startDate = new Date(data.start_date)
  const endDate = new Date(data.end_date)
  return endDate >= startDate
}, {
  message: "End date must be after or equal to start date",
  path: ["end_date"]
})

type EventFormData = z.infer<typeof eventSchema>

interface EventEditorProps {
  mode: 'create' | 'edit'
}

const EventEditor: React.FC<EventEditorProps> = ({ mode }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { logActivity } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [existingImage, setExistingImage] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
    { value: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ]

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: 'upcoming',
      is_featured: false,
      registration_required: false
    }
  })

  const watchedTitle = watch('title')
  const watchedRegistrationRequired = watch('registration_required')
  const watchedStatus = watch('status')

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadEvent()
    }
  }, [mode, id])

  const loadEvent = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const response = await strapiService.getEvent(parseInt(id))
      const event = response.data
      
      if (event) {
        reset({
          title: event.title,
          description: event.description,
          start_date: format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm"),
          end_date: format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm"),
          location: event.location,
          category: event.category,
          status: event.status,
          is_featured: event.is_featured || false,
          registration_required: event.registration_required || false,
          registration_link: event.registration_link || '',
          max_capacity: event.max_capacity || undefined
        })

        if (event.featured_image) {
          setExistingImage(event.featured_image)
          const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
          setImagePreview(`${baseUrl}${event.featured_image.url}`)
        }
      }
    } catch (error) {
      console.error('Error loading event:', error)
      toast.error('Failed to load event')
      navigate('/admin/events')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFeaturedImage(file)
      setExistingImage(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFeaturedImage(null)
    setExistingImage(null)
    setImagePreview(null)
  }

  const onSubmit = async (data: EventFormData) => {
    try {
      setSaving(true)
      
      let imageId: number | null = null
      
      // Upload new image if selected
      if (featuredImage) {
        const imageResponse = await strapiService.uploadFile(featuredImage)
        if (imageResponse && imageResponse.length > 0) {
          imageId = imageResponse[0].id
        }
      } else if (existingImage) {
        imageId = existingImage.id
      }

      // Prepare event data
      const eventData: any = {
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        category: data.category,
        status: data.status,
        is_featured: data.is_featured,
        registration_required: data.registration_required,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }

      if (data.registration_link && data.registration_required) {
        eventData.registration_link = data.registration_link
      }

      if (data.max_capacity) {
        eventData.max_capacity = data.max_capacity
      }

      if (imageId) {
        eventData.featured_image = imageId
      }

      if (mode === 'create') {
        const response = await strapiService.createEvent(eventData)
        await logActivity('create_event', 'event', response.data.id?.toString(), { title: data.title })
        toast.success('Event created successfully')
        navigate('/admin/events')
      } else if (mode === 'edit' && id) {
        await strapiService.updateEvent(parseInt(id), eventData)
        await logActivity('edit_event', 'event', id, { title: data.title })
        toast.success('Event updated successfully')
        navigate('/admin/events')
      }

    } catch (error) {
      console.error('Error saving event:', error)
      toast.error(`Failed to ${mode} event`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/events')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'create' ? 'Create New Event' : 'Edit Event'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Schedule a new event for mall visitors'
                : 'Update event details and information'
              }
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent text-lg"
                placeholder="Enter event title..."
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Description *
              </label>
              <textarea
                {...register('description')}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                placeholder="Describe your event, activities, and what visitors can expect..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    {...register('start_date')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                  />
                  {errors.start_date && (
                    <p className="text-red-600 text-sm mt-1">{errors.start_date.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    {...register('end_date')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                  />
                  {errors.end_date && (
                    <p className="text-red-600 text-sm mt-1">{errors.end_date.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                placeholder="e.g., Ground Floor, Grand Atrium"
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Registration */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('registration_required')}
                    className="w-4 h-4 text-royal-purple border-gray-300 rounded focus:ring-royal-purple"
                  />
                  <span className="text-sm text-gray-700">Registration Required</span>
                </label>

                {watchedRegistrationRequired && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Link
                      </label>
                      <input
                        type="url"
                        {...register('registration_link')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                        placeholder="https://registration-link.com"
                      />
                      {errors.registration_link && (
                        <p className="text-red-600 text-sm mt-1">{errors.registration_link.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Capacity
                      </label>
                      <input
                        type="number"
                        {...register('max_capacity', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                        placeholder="100"
                        min="1"
                      />
                      {errors.max_capacity && (
                        <p className="text-red-600 text-sm mt-1">{errors.max_capacity.message}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
              
              <Button
                type="submit"
                className="w-full"
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : (mode === 'create' ? 'Create Event' : 'Update Event')}
              </Button>

              {watchedTitle && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    URL: <code className="text-xs bg-white px-1 rounded">
                      /events/{watchedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                    </code>
                  </p>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {watchedStatus && (
                <div className="mt-2">
                  <Badge className={statusOptions.find(s => s.value === watchedStatus)?.color}>
                    {statusOptions.find(s => s.value === watchedStatus)?.label}
                  </Badge>
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Event image preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <label className="cursor-pointer">
                      <span className="text-royal-purple hover:text-dark-purple font-medium">
                        Upload an image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="w-4 h-4 text-royal-purple border-gray-300 rounded focus:ring-royal-purple"
                  />
                  <span className="text-sm text-gray-700">Featured Event</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EventEditor