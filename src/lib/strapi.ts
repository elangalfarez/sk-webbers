// src/lib/strapi.ts
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN

interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface StrapiItem {
  id: number
  attributes: any
}

// Content type interfaces
export interface BlogPost {
  id?: number
  title: string
  content: string
  slug: string
  category: string
  excerpt?: string
  featured_image?: any
  tags?: string[]
  published_at?: string
  author: string
  is_featured?: boolean
}

export interface Event {
  id?: number
  title: string
  description: string
  slug: string
  start_date: string
  end_date: string
  location: string
  category: string
  featured_image?: any
  gallery?: any[]
  is_featured?: boolean
  registration_required?: boolean
  registration_link?: string
  max_capacity?: number
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
}

export interface Promotion {
  id?: number
  title: string
  description: string
  slug: string
  discount_percentage?: number
  discount_amount?: number
  promo_code?: string
  valid_from: string
  valid_until: string
  terms_conditions?: string
  featured_image?: any
  tenant_name?: string
  category: string
  is_active?: boolean
  is_featured?: boolean
  priority?: number
}

class StrapiService {
  private baseUrl: string
  private token: string | undefined

  constructor() {
    this.baseUrl = STRAPI_URL
    this.token = STRAPI_TOKEN
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<StrapiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Generic CRUD operations
  async find<T>(
    collection: string, 
    params: Record<string, any> = {}
  ): Promise<StrapiResponse<T[]>> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(`${key}[]`, v))
      } else {
        searchParams.append(key, value)
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/${collection}${queryString ? `?${queryString}` : ''}`
    
    return this.request<T[]>(endpoint)
  }

  async findOne<T>(
    collection: string, 
    id: number,
    params: Record<string, any> = {}
  ): Promise<StrapiResponse<T>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value)
    })

    const queryString = searchParams.toString()
    const endpoint = `/${collection}/${id}${queryString ? `?${queryString}` : ''}`
    
    return this.request<T>(endpoint)
  }

  async create<T>(
    collection: string, 
    data: any
  ): Promise<StrapiResponse<T>> {
    return this.request<T>(`/${collection}`, {
      method: 'POST',
      body: JSON.stringify({ data })
    })
  }

  async update<T>(
    collection: string, 
    id: number, 
    data: any
  ): Promise<StrapiResponse<T>> {
    return this.request<T>(`/${collection}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data })
    })
  }

  async delete(collection: string, id: number): Promise<void> {
    await this.request(`/${collection}/${id}`, {
      method: 'DELETE'
    })
  }

  // Blog operations
  async getBlogs(params?: Record<string, any>) {
    return this.find<BlogPost>('blogs', {
      populate: 'featured_image',
      sort: 'createdAt:desc',
      ...params
    })
  }

  async getBlog(id: number) {
    return this.findOne<BlogPost>('blogs', id, {
      populate: 'featured_image'
    })
  }

  async createBlog(data: Partial<BlogPost>) {
    return this.create<BlogPost>('blogs', data)
  }

  async updateBlog(id: number, data: Partial<BlogPost>) {
    return this.update<BlogPost>('blogs', id, data)
  }

  async deleteBlog(id: number) {
    return this.delete('blogs', id)
  }

  // Event operations
  async getEvents(params?: Record<string, any>) {
    return this.find<Event>('events', {
      populate: ['featured_image', 'gallery'],
      sort: 'start_date:desc',
      ...params
    })
  }

  async getEvent(id: number) {
    return this.findOne<Event>('events', id, {
      populate: ['featured_image', 'gallery']
    })
  }

  async createEvent(data: Partial<Event>) {
    return this.create<Event>('events', data)
  }

  async updateEvent(id: number, data: Partial<Event>) {
    return this.update<Event>('events', id, data)
  }

  async deleteEvent(id: number) {
    return this.delete('events', id)
  }

  // Promotion operations
  async getPromotions(params?: Record<string, any>) {
    return this.find<Promotion>('promotions', {
      populate: 'featured_image',
      sort: 'priority:desc,createdAt:desc',
      ...params
    })
  }

  async getPromotion(id: number) {
    return this.findOne<Promotion>('promotions', id, {
      populate: 'featured_image'
    })
  }

  async createPromotion(data: Partial<Promotion>) {
    return this.create<Promotion>('promotions', data)
  }

  async updatePromotion(id: number, data: Partial<Promotion>) {
    return this.update<Promotion>('promotions', id, data)
  }

  async deletePromotion(id: number) {
    return this.delete('promotions', id)
  }

  // Upload file
  async uploadFile(file: File): Promise<any> {
    const formData = new FormData()
    formData.append('files', file)

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      headers: this.token ? {
        Authorization: `Bearer ${this.token}`
      } : {},
      body: formData
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    return response.json()
  }
}

export const strapiService = new StrapiService()