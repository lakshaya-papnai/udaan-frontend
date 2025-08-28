import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api'; 
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlaneTakeoff, PlaneLanding, Clock, IndianRupee, CalendarDays } from 'lucide-react';
import bgImage from '../assets/splash-screen-img.png';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const source = searchParams.get('source');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = { source, destination };
        if (date) params.date = date;

        const { data } = await api.get('/flights/search', { params });
        setFlights(data);
      } catch (err) {
        console.error('API Error:', err.response?.data || err.message);
        setError('Could not fetch flights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (source && destination) {
      fetchFlights();
    } else {
      setLoading(false);
      setError('Please provide both source and destination to search for flights.');
    }
  }, [source, destination, date]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-red-600">{error}</h3>
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Back to Search
          </Link>
        </div>
      );
    }
    if (flights.length > 0) {
      return (
        <div className="space-y-4">
          {flights.map((flight) => (
            <Link to={`/book/${flight._id}`} key={flight._id} className="block group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Top Section: Airline Info & Price */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-base sm:text-lg">
                          {flight.airline.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-base sm:text-lg text-slate-800">{flight.airline}</p>
                          <p className="text-xs sm:text-sm text-slate-500">{flight.flightNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-bold text-blue-600 flex items-center justify-end">
                          <IndianRupee size={20} className="mr-0.5" />
                          {flight.price.toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500">per person</p>
                      </div>
                    </div>

                    {/* Flight Times  */}
                    <div className="flex items-center justify-between border-t pt-4">
                       <div className="text-left">
                        <p className="font-bold text-lg sm:text-xl text-slate-900">{formatTime(flight.departureTime)}</p>
                        <p className="font-semibold text-sm text-slate-600">{flight.source}</p>
                        <p className="text-xs text-slate-500">{formatDate(flight.departureTime)}</p>
                      </div>
                      <div className="flex-grow text-center text-slate-400 px-2 sm:px-4">
                        <Clock size={18} className="mx-auto" />
                        <div className="w-full h-0.5 bg-slate-200 mt-1"></div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg sm:text-xl text-slate-900">{formatTime(flight.arrivalTime)}</p>
                        <p className="font-semibold text-sm text-slate-600">{flight.destination}</p>
                        <p className="text-xs text-slate-500">{formatDate(flight.arrivalTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-600 text-white text-center py-2 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Select Flight
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700">
          No direct flights found for your search.
        </h3>
        <p className="text-slate-500 mt-2">Try adjusting your search criteria or date.</p>
        <Link
          to="/"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Modify Search
        </Link>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-slate-100 py-8 sm:py-12 px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center justify-center gap-2 sm:gap-4">
            <PlaneTakeoff />
            <span>
              <span className="hidden sm:inline">Flights from </span>
              {source || '___'} to {destination || '___'}
            </span>
            <PlaneLanding />
          </h1>
          {date ? (
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Showing results for:{' '}
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          ) : (
            <p className="text-slate-500 mt-1 text-sm sm:text-base">Showing all available flights</p>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default SearchResultsPage;
