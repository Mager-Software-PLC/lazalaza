import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

export default function StickyCTA() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Link to="/book">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-4 px-6 rounded-full shadow-2xl flex items-center space-x-2 group transition-all duration-300"
        >
          <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Request Us</span>
          <span className="sm:hidden">Request</span>
        </motion.button>
      </Link>
    </motion.div>
  )
}

