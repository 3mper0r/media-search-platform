import SearchBar from "@/components/search/SearchBar";
import Filters from "@/components/search/Filters";
import ResultsList from "@/components/search/ResultsList";
import Pagination from "@/components/search/Pagination";
import useSearch from "@/hooks/useSearch";
import SortToggle from "@/components/search/SortToggle";
import Loader from "@/components/UI/LoaderAnimation";
import useDarkMode from "@/hooks/useDarkMode";
import { Sun, Moon } from "lucide-react";
import SearchPanel from "@/components/search/SearchPanel";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#fef9f0_0%,_#f3f4f6_50%,_#e5e7eb_100%)] dark:bg-[radial-gradient(ellipse_at_top_left,_#1c1917_0%,_#111827_60%,_#030712_100%)]">
      <Loader />

      {/* Vertical IMAGO text — more dramatic */}
      <div className="hidden lg:flex fixed top-0 left-0 h-screen items-center pl-2 pointer-events-none z-0">
        <span
          className="text-[9rem] rotate-180 font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-200 via-gray-300 to-transparent dark:from-gray-800 dark:via-gray-700 dark:to-transparent tracking-[0.3em] uppercase leading-none select-none"
          style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
        >
          IMAGO
        </span>
      </div>

      <div className="w-4/5 mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Suspense fallback={null}>
            <SearchPanel />
          </Suspense>

          {/* Right sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-5 lg:mt-16">

            {/* Hot Right Now — bolder */}
            <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 dark:from-amber-600 dark:via-orange-600 dark:to-rose-600 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
              {/* Decorative blur orb */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none" />
              
              <p className="text-white/90 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <span className="animate-pulse">🔥</span> Hot Right Now
              </p>
              <h3 className="text-base font-black text-white leading-snug mb-2">
                New Media Collection Released Today!
              </h3>
              <p className="text-white/90 font-bold text-xs leading-relaxed">
                Stay ahead with trending photographers and the latest assets.
              </p>
              <button className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200">
                Explore →
              </button>
            </div>

            {/* Stats card */}
            <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
              {/* Top accent line */}
              <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
              
              <h2 className="text-base font-black text-gray-900 dark:text-gray-100 tracking-tight">
                Media Library
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2">
                100M+ assets ready for your projects
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Photographers", value: "1,234" },
                  { label: "Videos", value: "4,567" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors duration-200"
                  >
                    <p className="text-lg font-black text-gray-900 dark:text-gray-100 tabular-nums">{value}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}