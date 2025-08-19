// src/components/admin/BlogEditor.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Save, 
  Upload, 
  Eye, 
  ArrowLeft, 
  Image as ImageIcon,
  X,
  Calendar,
  Tag,
  User,
  FileText
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { strapiService, BlogPost } from '@/lib/strapi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

// Form validation schema
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  category: z.string().min(1, 'Category is required'),
  author: z.string().min(1, 'Author is required'),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional(),
  tags: z.string().optional()
})

type BlogFormData = z.infer<typeof blogSchema>

interface BlogEditorProps {
  mode: 'create' | 'edit'
}

const BlogEditor: React.FC<BlogEditorProps> = ({ mode }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adminUser, logActivity } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [existingImage, setExistingImage] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      author: adminUser?.full_name || '',
      is_featured: false
    }
  })

  const watchedContent = watch('content')
  const watchedTitle = watch('title')

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadBlog()
    }
  }, [mode, id])

  const loadBlog = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const response = await strapiService.getBlog(parseInt(id))
      const blog = response.data
      
      if (blog) {
        reset({
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt || '',
          category: blog.category,
          author: blog.author,
          is_featured: blog.is_featured || false,
          published_at: blog.published_at || '',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : ''
        })

        if (blog.featured_image) {
          setExistingImage(blog.featured_image)
          const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
          setImagePreview(`${baseUrl}${blog.featured_image.url}`)
        }
      }
    } catch (error) {
      console.error('Error loading blog:', error)
      toast.error('Failed to load blog post')
      navigate('/admin/blogs')
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

  const onSubmit = async (data: BlogFormData) => {
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

      // Prepare blog data
      const blogData: any = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        author: data.author,
        is_featured: data.is_featured,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      }

      if (imageId) {
        blogData.featured_image = imageId
      }

      if (data.published_at) {
        blogData.published_at = data.published_at
      }

      if (mode === 'create') {
        const response = await strapiService.createBlog(blogData)
        await logActivity('create_blog', 'blog', response.data.id?.toString(), { title: data.title })
        toast.success('Blog post created successfully')
        navigate('/admin/blogs')
      } else if (mode === 'edit' && id) {
        await strapiService.updateBlog(parseInt(id), blogData)
        await logActivity('edit_blog', 'blog', id, { title: data.title })
        toast.success('Blog post updated successfully')
        navigate('/admin/blogs')
      }

    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error(`Failed to ${mode} blog post`)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    const formData = watch()
    await onSubmit({ ...formData, published_at: '' })
  }

  const handlePublish = async () => {
    const formData = watch()
    await onSubmit({ ...formData, published_at: new Date().toISOString() })
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
            onClick={() => navigate('/admin/blogs')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Share news and updates with your visitors'
                : 'Update your blog post content'
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
                Article Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent text-lg"
                placeholder="Enter your blog post title..."
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Simple Toolbar */}
                <div className="bg-gray-50 border-b border-gray-300 p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Rich text editor - Use Markdown syntax for formatting</span>
                  </div>
                </div>
                
                <textarea
                  {...register('content')}
                  rows={20}
                  className="w-full p-4 border-0 focus:ring-0 focus:outline-none resize-none font-mono text-sm"
                  placeholder="Write your blog content here...

You can use Markdown formatting:
# Heading 1
## Heading 2
**Bold text**
*Italic text*
[Link text](url)
![Image alt text](image-url)

- List item 1
- List item 2

> Blockquote text"
                />
              </div>
              {errors.content && (
                <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
              )}
              
              <div className="mt-2 text-sm text-gray-500">
                Characters: {watchedContent?.length || 0}
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (SEO Description)
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                placeholder="Brief description for search engines and social media..."
              />
              {errors.excerpt && (
                <p className="text-red-600 text-sm mt-1">{errors.excerpt.message}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
              
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Draft'}
                </Button>
                
                <Button
                  type="button"
                  className="w-full"
                  onClick={handlePublish}
                  disabled={saving}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {saving ? 'Publishing...' : 'Publish Now'}
                </Button>

                {watchedTitle && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      URL: <code className="text-xs bg-white px-1 rounded">
                        /{watchedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                      </code>
                    </p>
                  </div>
                )}
              </div>
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

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Featured image preview"
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

            {/* Author */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                {...register('author')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                placeholder="Author name"
              />
              {errors.author && (
                <p className="text-red-600 text-sm mt-1">{errors.author.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                {...register('tags')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-purple focus:border-transparent"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
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
                  <span className="text-sm text-gray-700">Featured Article</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BlogEditor