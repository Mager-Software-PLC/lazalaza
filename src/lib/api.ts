const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'

export const api = {
  // Tours (formerly Services)
  getServices: async () => {
    const res = await fetch(`${API_URL}/tours`)
    if (!res.ok) throw new Error('Failed to fetch tours')
    return res.json()
  },

  getServiceById: async (id: string) => {
    const res = await fetch(`${API_URL}/tours/${id}`)
    if (!res.ok) throw new Error('Failed to fetch tour')
    return res.json()
  },

  getServiceBySlug: async (slug: string) => {
    const res = await fetch(`${API_URL}/tours/slug/${slug}`)
    if (!res.ok) throw new Error('Failed to fetch tour')
    return res.json()
  },

  // Bookings
  createBooking: async (data: any) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to create booking')
    }
    return res.json()
  },

  // Testimonials
  getTestimonials: async () => {
    const res = await fetch(`${API_URL}/testimonials`)
    if (!res.ok) throw new Error('Failed to fetch testimonials')
    return res.json()
  },

  createTestimonial: async (data: any) => {
    const res = await fetch(`${API_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to submit testimonial')
    }
    return res.json()
  },

  // Guides
  getGuides: async () => {
    const res = await fetch(`${API_URL}/guides`)
    if (!res.ok) throw new Error('Failed to fetch guides')
    return res.json()
  },

  // Contact
  createContact: async (data: any) => {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to send message')
    }
    return res.json()
  },

  // Admin
  adminLogin: async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }))
        throw new Error(error.error || 'Login failed')
      }
      return res.json()
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
        if (isProduction) {
          throw new Error(`Cannot connect to backend server at ${API_URL}. Please check your VITE_API_URL_URL environment variable and rebuild the frontend. Current API URL: ${API_URL}`)
        } else {
          throw new Error(`Cannot connect to backend server. Make sure it's running on ${API_URL.replace('/api', '')}. Run: npm run server`)
        }
      }
      throw error
    }
  },

  // Admin authenticated requests
  adminRequest: async (endpoint: string, options: Omit<RequestInit, 'body'> & { body?: BodyInit | object | null } = {}) => {
    const token = localStorage.getItem('admin_token')
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.')
    }
    
    const { body, ...restOptions } = options
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        ...restOptions,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        body: typeof body === 'string' ? body : body ? JSON.stringify(body) : undefined,
      })
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }))
        
        // Handle authentication errors
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          
          // Check for specific JWT errors
          if (error.details && error.details.includes('invalid signature')) {
            throw new Error('Your session token is invalid. Please log out and log back in.')
          } else if (error.details && error.details.includes('expired')) {
            throw new Error('Your session has expired. Please log in again.')
          } else {
            throw new Error(error.error || 'Invalid or expired token. Please log in again.')
          }
        }
        
        throw new Error(error.error || 'Request failed')
      }
      return res.json()
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error(`Cannot connect to backend server. Make sure it's running on ${API_URL.replace('/api', '')}`)
      }
      throw error
    }
  },

  // CMS - Public (for frontend)
  getCMSSettings: async () => {
    const res = await fetch(`${API_URL}/cms/settings`)
    if (!res.ok) throw new Error('Failed to fetch CMS settings')
    return res.json()
  },

  getCMSContent: async (section?: string, page?: string) => {
    const params = new URLSearchParams()
    if (section) params.append('section', section)
    if (page) params.append('page', page)
    const res = await fetch(`${API_URL}/cms/content?${params}`)
    if (!res.ok) throw new Error('Failed to fetch CMS content')
    return res.json()
  },

  getCMSColors: async () => {
    const res = await fetch(`${API_URL}/cms/colors`)
    if (!res.ok) throw new Error('Failed to fetch CMS colors')
    return res.json()
  },

  getCMSFeatures: async () => {
    const res = await fetch(`${API_URL}/cms/features`)
    if (!res.ok) throw new Error('Failed to fetch CMS features')
    return res.json()
  },

  getCMSHero: async () => {
    const res = await fetch(`${API_URL}/cms/hero`)
    if (!res.ok) throw new Error('Failed to fetch hero settings')
    return res.json()
  },

  getAllCMSData: async () => {
    const res = await fetch(`${API_URL}/cms/all`)
    if (!res.ok) throw new Error('Failed to fetch CMS data')
    return res.json()
  },

  // CMS - Admin
  updateCMSSetting: async (key: string, value: any, type?: string, category?: string) => {
    return api.adminRequest(`/cms/settings/${key}`, {
      method: 'PUT',
      body: { value, type, category },
    })
  },

  updateCMSSettings: async (settings: Record<string, any>) => {
    return api.adminRequest('/cms/settings', {
      method: 'PUT',
      body: settings,
    })
  },

  updateCMSContent: async (key: string, value: string, type?: string, section?: string, page?: string) => {
    return api.adminRequest(`/cms/content/${key}`, {
      method: 'PUT',
      body: { value, type, section, page },
    })
  },

  updateCMSContentMultiple: async (content: Record<string, string>) => {
    return api.adminRequest('/cms/content', {
      method: 'PUT',
      body: content,
    })
  },

  updateCMSColor: async (name: string, value: string, category?: string) => {
    return api.adminRequest(`/cms/colors/${name}`, {
      method: 'PUT',
      body: { value, category },
    })
  },

  updateCMSColors: async (colors: Record<string, string>) => {
    return api.adminRequest('/cms/colors', {
      method: 'PUT',
      body: colors,
    })
  },

  updateCMSFeature: async (key: string, enabled: boolean, config?: any) => {
    return api.adminRequest(`/cms/features/${key}`, {
      method: 'PUT',
      body: { enabled, config },
    })
  },

  updateCMSHero: async (heroData: any) => {
    return api.adminRequest('/cms/hero', {
      method: 'PUT',
      body: heroData,
    })
  },

  getMedia: async (category?: string, type?: string) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (type) params.append('type', type)
    return api.adminRequest(`/cms/media?${params}`)
  },

  uploadMedia: async (file: File, altText?: string, description?: string, category?: string) => {
    console.log('📤 Starting file upload...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      altText,
      description,
      category
    })

    const formData = new FormData()
    formData.append('file', file)
    if (altText) formData.append('alt_text', altText)
    if (description) formData.append('description', description)
    if (category) formData.append('category', category)

    const token = localStorage.getItem('admin_token')
    if (!token) {
      console.error('❌ No admin token found')
      throw new Error('Not authenticated. Please log in again.')
    }

    const uploadUrl = `${API_URL}/cms/media/upload`
    console.log('🌐 Upload URL:', uploadUrl)
    console.log('🔑 Token present:', !!token)

    try {
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      })

      console.log('📥 Response received:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        headers: Object.fromEntries(res.headers.entries())
      })

      if (!res.ok) {
        let error
        try {
          error = await res.json()
        } catch (parseError) {
          const text = await res.text()
          console.error('❌ Failed to parse error response:', text)
          error = { error: `HTTP ${res.status}: ${res.statusText}`, details: text }
        }

        // Handle authentication errors - clear token and show helpful message
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          
          // Check for specific JWT errors
          if (error.details && error.details.includes('invalid signature')) {
            throw new Error('Your session token is invalid. Please log out and log back in to fix this.')
          } else if (error.details && error.details.includes('expired')) {
            throw new Error('Your session has expired. Please log in again.')
          } else {
            throw new Error(error.error || 'Authentication failed. Please log in again.')
          }
        }

        // Always log the FULL error response object
        console.error('❌ Upload error response FULL:', JSON.stringify(error, null, 2))
        console.error('❌ Upload error response keys:', Object.keys(error))
        console.error('❌ Error object:', error)
        
        // Build comprehensive error message - check ALL possible fields
        let errorMessage = error.details || 
                          error.error || 
                          error.originalError || 
                          error.sqlError ||
                          error.message ||
                          `HTTP ${res.status}: ${res.statusText}` ||
                          'Upload failed'
        
        // Always log the full error response
        console.error('❌ Upload error response summary:', {
          status: res.status,
          statusText: res.statusText,
          errorField: error.error,
          detailsField: error.details,
          originalErrorField: error.originalError,
          sqlErrorField: error.sqlError,
          typeField: error.type,
          fullError: error,
          url: uploadUrl
        })
        
        // Include additional info if available
        if (error.type && error.type !== 'Unknown') {
          errorMessage += ` (${error.type})`
        }
        
        throw new Error(errorMessage)
      }

      const result = await res.json()
      console.log('✅ Upload successful:', result)
      return result
    } catch (error: any) {
      console.error('❌ Upload exception:', error)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to server. Make sure backend is running on ${API_URL.replace('/api', '')}`)
      }
      throw error
    }
  },

  deleteMedia: async (id: number) => {
    return api.adminRequest(`/cms/media/${id}`, {
      method: 'DELETE',
    })
  },

  // Gallery - Public
  getGallery: async () => {
    const res = await fetch(`${API_URL}/cms/gallery`)
    if (!res.ok) throw new Error('Failed to fetch gallery')
    return res.json()
  },

  // Gallery - Admin
  getGalleryManage: async () => {
    return api.adminRequest('/cms/gallery/manage')
  },

  addToGallery: async (mediaId: number) => {
    return api.adminRequest('/cms/gallery', {
      method: 'POST',
      body: { media_id: mediaId },
    })
  },

  removeFromGallery: async (id: number) => {
    return api.adminRequest(`/cms/gallery/${id}`, {
      method: 'DELETE',
    })
  },

  reorderGallery: async (items: Array<{ id: number; order_index: number }>) => {
    return api.adminRequest('/cms/gallery/reorder', {
      method: 'PUT',
      body: { items },
    })
  },

  // Dashboard Analytics
  getDashboardStats: async () => {
    return api.adminRequest('/admin/dashboard/stats')
  },

  // Change Password
  changePassword: async (currentPassword: string, newPassword: string) => {
    return api.adminRequest('/admin/change-password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    })
  },

  // Admin Users Management
  getAllAdmins: async () => {
    return api.adminRequest('/admin/admins')
  },

  createAdmin: async (username: string, password: string, email?: string) => {
    return api.adminRequest('/admin/register', {
      method: 'POST',
      body: { username, password, email },
    })
  },

  deleteAdmin: async (id: number) => {
    return api.adminRequest(`/admin/admins/${id}`, {
      method: 'DELETE',
    })
  },

  // Achievements
  getAchievements: async () => {
    const res = await fetch(`${API_URL}/achievements`)
    if (!res.ok) throw new Error('Failed to fetch achievements')
    return res.json()
  },

  getAdminAchievements: async () => {
    return api.adminRequest('/achievements/admin')
  },

  createAchievement: async (data: any) => {
    return api.adminRequest('/achievements', {
      method: 'POST',
      body: data,
    })
  },

  updateAchievement: async (id: number, data: any) => {
    return api.adminRequest(`/achievements/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  deleteAchievement: async (id: number) => {
    return api.adminRequest(`/achievements/${id}`, {
      method: 'DELETE',
    })
  },

  reorderAchievements: async (items: Array<{ id: number; order_index: number }>) => {
    return api.adminRequest('/achievements/reorder', {
      method: 'PUT',
      body: { items },
    })
  },

  // Section Ordering
  getSectionVisibility: async () => {
    const res = await fetch(`${API_URL}/cms/sections`)
    if (!res.ok) throw new Error('Failed to fetch section visibility')
    return res.json()
  },

  updateSectionVisibility: async (key: string, visible: boolean, order_index?: number) => {
    return api.adminRequest(`/cms/sections/${key}`, {
      method: 'PUT',
      body: { visible, order_index },
    })
  },

  reorderSections: async (sections: Array<{ section_key: string; order_index: number; visible: boolean; section_name?: string }>) => {
    return api.adminRequest('/cms/sections/reorder', {
      method: 'PUT',
      body: { sections },
    })
  },

  // Section Styles
  getSectionStyles: async (published?: boolean) => {
    const params = new URLSearchParams()
    if (published) params.append('published', 'true')
    const res = await fetch(`${API_URL}/cms/section-styles?${params}`)
    if (!res.ok) throw new Error('Failed to fetch section styles')
    return res.json()
  },

  getSectionStyle: async (key: string, published?: boolean) => {
    const params = new URLSearchParams()
    if (published) params.append('published', 'true')
    const res = await fetch(`${API_URL}/cms/section-styles/${key}?${params}`)
    if (!res.ok) throw new Error('Failed to fetch section style')
    return res.json()
  },

  updateSectionStyle: async (key: string, styleData: any) => {
    return api.adminRequest(`/cms/section-styles/${key}`, {
      method: 'PUT',
      body: styleData,
    })
  },

  publishSectionStyle: async (key: string) => {
    return api.adminRequest(`/cms/section-styles/${key}/publish`, {
      method: 'POST',
    })
  },

  publishAllSectionStyles: async () => {
    return api.adminRequest('/cms/section-styles/publish-all', {
      method: 'POST',
    })
  },

  // Navbar Items
  getNavbarItems: async (active?: boolean) => {
    const params = new URLSearchParams()
    if (active) params.append('active', 'true')
    const res = await fetch(`${API_URL}/cms/navbar?${params}`)
    if (!res.ok) throw new Error('Failed to fetch navbar items')
    return res.json()
  },

  getNavbarItemsManage: async () => {
    return api.adminRequest('/cms/navbar/manage')
  },

  createNavbarItem: async (itemData: any) => {
    return api.adminRequest('/cms/navbar', {
      method: 'POST',
      body: itemData,
    })
  },

  updateNavbarItem: async (id: number, itemData: any) => {
    return api.adminRequest(`/cms/navbar/${id}`, {
      method: 'PUT',
      body: itemData,
    })
  },

  deleteNavbarItem: async (id: number) => {
    return api.adminRequest(`/cms/navbar/${id}`, {
      method: 'DELETE',
    })
  },

  reorderNavbarItems: async (items: Array<{ id: number; order_index: number }>) => {
    return api.adminRequest('/cms/navbar/reorder', {
      method: 'PUT',
      body: { items },
    })
  },

  // Videos - Public
  getVideos: async () => {
    const res = await fetch(`${API_URL}/videos`)
    if (!res.ok) throw new Error('Failed to fetch videos')
    return res.json()
  },

  // Videos - Admin
  getAllVideos: async () => {
    return api.adminRequest('/videos/all')
  },

  createVideo: async (data: any) => {
    return api.adminRequest('/videos', {
      method: 'POST',
      body: data,
    })
  },

  updateVideo: async (id: number, data: any) => {
    return api.adminRequest(`/videos/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  deleteVideo: async (id: number) => {
    return api.adminRequest(`/videos/${id}`, {
      method: 'DELETE',
    })
  },

  reorderVideos: async (items: Array<{ id: number; order_index: number }>) => {
    return api.adminRequest('/videos/reorder', {
      method: 'PUT',
      body: { videos: items },
    })
  },

  // Partners - Public
  getPartners: async () => {
    const res = await fetch(`${API_URL}/partners`)
    if (!res.ok) throw new Error('Failed to fetch partners')
    return res.json()
  },

  // Partners - Admin
  getAllPartners: async () => {
    return api.adminRequest('/partners/all')
  },

  createPartner: async (data: any) => {
    return api.adminRequest('/partners', {
      method: 'POST',
      body: data,
    })
  },

  updatePartner: async (id: number, data: any) => {
    return api.adminRequest(`/partners/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  deletePartner: async (id: number) => {
    return api.adminRequest(`/partners/${id}`, {
      method: 'DELETE',
    })
  },

  reorderPartners: async (items: Array<{ id: number; order_index: number }>) => {
    return api.adminRequest('/partners/reorder', {
      method: 'PUT',
      body: { partners: items },
    })
  },
}

