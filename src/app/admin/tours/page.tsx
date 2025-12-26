import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'

export default function AdminServices() {
  const [Services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const data = await api.adminRequest('/Services')
      setServices(data)
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      await api.adminRequest(`/Services/${id}`, { method: 'DELETE' })
      fetchServices()
    } catch (error) {
      alert('Failed to delete service')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Services Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your services and packages</p>
        </motion.div>
        <Link to="/admin/Services/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </motion.button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white via-primary-50/30 to-ocean-50/30 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl shadow-xl overflow-hidden border border-primary-200/50 dark:border-primary-800/50">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-accent-500/10 dark:from-slate-700 dark:to-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Group Size
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {Services.map((Service) => (
                <tr key={Service.id} className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:via-purple-50/50 hover:to-accent-50/50 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-300 border-b border-primary-100/30 dark:border-slate-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {Service.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">${Service.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{Service.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Service.group_size}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/admin/Services/${Service.id}`}>
                        <button className="text-primary-600 hover:text-primary-700 p-2 rounded-lg bg-gradient-to-br from-primary-100 to-ocean-100 dark:from-primary-900/20 dark:to-ocean-900/20 hover:from-primary-200 hover:to-ocean-200 transition-all shadow-sm hover:shadow-md">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(Service.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 hover:from-red-200 hover:to-orange-200 transition-all shadow-sm hover:shadow-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {Services.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No services yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Create your first service package to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

