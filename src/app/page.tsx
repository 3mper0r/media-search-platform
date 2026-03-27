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

export default function Home() {
  //const search = useSearch();
  //const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Loader />
      {/* Vertical IMAGO text */}
      
      <div className="hidden lg:flex fixed top-0 left-0 h-screen items-center pl-4 pointer-events-none z-0">
        <span
          className="text-[10rem] rotate-180 font-extrabold text-gray-200 dark:text-gray-700 tracking-widest uppercase leading-none"
          style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
        >
          IMAGO
        </span>
      </div>
      <div className="w-4/5 mx-auto p-6">
        {/* Flex container: left = main content, right = hero card */}
        <div className="flex flex-col lg:flex-row gap-6">

            <SearchPanel/>
            {/* Right Column: Stats + News */}
            <div className="w-full lg:w-80 flex flex-col gap-6 lg:mt-16">
            {/* Hot Right Now Card */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-5 shadow-lg hover:shadow-xl transition flex flex-col gap-3">
              <p className="text-yellow-600 dark:text-orange-400 text-sm font-semibold uppercase flex items-center gap-1">
                🔥 Hot Right Now
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">
                New Media Collection Released Today!
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Check out the latest assets added to our library. Stay ahead with trending photographers and videos.
              </p>
              <button className="mt-3 bg-orange-200 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2 text-sm font-medium hover:bg-yellow-300 dark:hover:bg-yellow-500 transition">
                Explore
              </button>
            </div>

            {/* Media Library Stats */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-md flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Explore Our Media Library
              </h2>
              <p className="text-gray-500 dark:text-gray-300">
                Over 100 assets ready for your projects
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center shadow hover:shadow-lg transition">
                  <p className="text-gray-900 dark:text-gray-100 font-bold">Photographers</p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">1234</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center shadow hover:shadow-lg transition">
                  <p className="text-gray-900 dark:text-gray-100 font-bold">Videos</p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}