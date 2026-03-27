import React from 'react'
import SearchBar from '../search/SearchBar'

const Hero = ({search, data}: any) => {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 mb-6 shadow-md">
  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
    Explore Our Media Library
  </h2>
  <p className="text-gray-600 dark:text-gray-300 mb-6">
    Over {search.data?.total || "—"} assets ready for your projects
  </p>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition">
      <p className="text-gray-900 dark:text-gray-100 font-bold">Photographers</p>
      <p className="text-gray-500 dark:text-gray-300 text-sm">1234</p>
    </div>
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition">
      <p className="text-gray-900 dark:text-gray-100 font-bold">Videos</p>
      <p className="text-gray-500 dark:text-gray-300 text-sm">4567</p>
    </div>
    {/* add more stat cards as needed */}
  </div>
</div>
  )
}

export default Hero
