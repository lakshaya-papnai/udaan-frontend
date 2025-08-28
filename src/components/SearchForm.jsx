import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, MapPin, Calendar, Search, Sparkles, Plane, Repeat } from 'lucide-react';

const SearchForm = () => {
  const cities = ['DEL', 'MUM', 'BLR', 'KOL', 'PUNE', 'GOA'];
  const [source, setSource] = useState('DEL');
  const [destination, setDestination] = useState('MUM');
  const [date, setDate] = useState('');
  const [useSmartRoute, setUseSmartRoute] = useState(false);
  const navigate = useNavigate();

  const swapCities = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const basePath = useSmartRoute ? '/smart-results' : '/results';
    const query = `${basePath}?source=${source}&destination=${destination}&date=${date}`;
    navigate(query);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button className="flex items-center gap-2 text-blue-600 font-semibold border-b-2 border-blue-600 pb-2 text-sm sm:text-base">
            <Plane size={18} /> <span>Flights</span>
          </button>
        </div>
      </div>
      <form onSubmit={handleSearch} className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4 relative">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm sm:text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                  {cities.map(c => <option key={`from-${c}`} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm sm:text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                  {cities.map(c => <option key={`to-${c}`} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-3">
              <button type="button" onClick={swapCities} className="w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 hover:rotate-180">
                <ArrowLeftRight size={18} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Departure (Optional)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm sm:text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Passengers</label>
            <input type="text" value="1 Adult, Economy" disabled className="w-full px-4 py-2 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm sm:text-base font-semibold text-slate-800 cursor-not-allowed" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-slate-600 mb-4 md:mb-0">
            <input id="smartRoute" type="checkbox" checked={useSmartRoute} onChange={(e) => setUseSmartRoute(e.target.checked)} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
            <label htmlFor="smartRoute" className="select-none font-semibold flex items-center gap-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Find Cheapest Route
            </label>
          </div>
          <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg text-base sm:text-lg transform hover:scale-105">
            <Search className="h-5 sm:h-6 w-5 sm:w-6" />
            <span>Search Flights</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
