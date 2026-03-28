import React from 'react'
import SearchBar from '../search/SearchBar'

const Hero = ({search, data}: any) => {
  return (
    
<div className="pb-10 relative">
  {/* Live badge */}
  <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-gray-100 dark:border-gray-700 rounded-full px-3 py-1.5 mb-8">
    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
    <span className="text-[11px] text-gray-500 dark:text-gray-400 tracking-wide">Live collection — updated daily</span>
  </div>

  {/* Eyebrow */}
  <div className="flex items-center gap-3 mb-5">
    <div className="w-8 h-[1.5px] bg-amber-500" />
    <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber-500">Visual Intelligence Platform</span>
  </div>

  {/* Headline */}
  <h1 className="font-serif text-5xl xl:text-6xl font-bold leading-[1.1] text-gray-900 dark:text-gray-50 mb-1">
    The world's most trusted
  </h1>
  <h1 className="font-serif text-5xl xl:text-6xl font-bold italic leading-[1.1] text-amber-500 mb-8">
    visual archive.
  </h1>

  <p className="text-[15px] font-light text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed mb-10">
    From breaking news to timeless stories — search, license, and publish with confidence. Trusted by the world's leading newsrooms.
  </p>

  {/* CTAs */}
  {/* <div className="flex items-center gap-5">
    <button className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full px-7 py-3 text-sm font-medium hover:opacity-80 transition">
      Start searching →
    </button>
    <button className="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition flex items-center gap-1.5">
      ▶ Watch demo
    </button>
  </div> */}

  {/* Stats */}
  <div className="flex gap-10 border-t border-gray-100 dark:border-gray-800">
    {[
      { num: "100M+", label: "Photos" },
      { num: "850K+", label: "Video clips" },
      { num: "120K+", label: "Photographers" },
      { num: "500+",  label: "Media partners" },
    ].map(({ num, label }) => (
      <div key={label} className="flex flex-col gap-1">
        <span className="font-serif text-3xl font-bold text-gray-900 dark:text-gray-50">{num}</span>
        <span className="text-[11px] uppercase tracking-widest text-gray-400">{label}</span>
      </div>
    ))}
  </div>
</div>
  )
}

export default Hero
