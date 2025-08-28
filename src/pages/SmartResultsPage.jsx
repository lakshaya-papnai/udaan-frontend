import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api';
import { PlaneTakeoff, PlaneLanding, Clock, IndianRupee, Sparkles } from 'lucide-react';
import bgImage from '../assets/splash-screen-img.png';

const SmartResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const source = searchParams.get('source');
  const destination = searchParams.get('destination');

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/flights/route', { params: { source, destination } });
        setRoute(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not find a route.');
      } finally {
        setLoading(false);
      }
    };
    if (source && destination) fetchRoute();
  }, [source, destination]);

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const getLayoverDuration = (arrival, departure) => {
    const ms = new Date(departure) - new Date(arrival);
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    if (error) return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-red-600">{error}</h3>
        <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Go Back to Search</Link>
      </div>
    );

    if (route?.path?.length > 0) {
      const isMultiStop = route.path.length > 1;

      return (
        <div>
          {!isMultiStop && (
            <div className="text-center bg-green-100 p-3 rounded-lg mb-4 border border-green-300">
              <p className="font-semibold text-green-800">Smart Search found the cheapest direct flight for you!</p>
            </div>
          )}

          <div className="space-y-0">
            {route.path.map((flight, index) => (
              <div key={flight._id} className="relative">
                {/* Vertical connecting line for the timeline */}
                {isMultiStop && index < route.path.length -1 && (
                  <div className="absolute left-7 top-14 h-full border-l-2 border-dashed border-slate-300"></div>
                )}
                
                <div className="flex items-start gap-4">
                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                      {index + 1}
                    </div>
                  </div>

                  <div className="w-full">
                    <Link to={`/book/${flight._id}`} className="block group">
                      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.01]">
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center gap-4 w-full md:w-1/3">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
                                {flight.airline.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-lg text-slate-800">{flight.airline}</p>
                                <p className="text-sm text-slate-500">{flight.flightNumber}</p>
                              </div>
                            </div>
                            <div className="w-full md:w-1/3 flex items-center justify-center my-4 md:my-0">
                              <div className="text-right">
                                <p className="font-bold text-xl text-slate-900">{formatTime(flight.departureTime)}</p>
                                <p className="font-semibold text-slate-600">{flight.source}</p>
                              </div>
                              <div className="flex-grow text-center text-slate-400 px-4">
                                <div className="w-full h-0.5 bg-slate-200"></div>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-xl text-slate-900">{formatTime(flight.arrivalTime)}</p>
                                <p className="font-semibold text-slate-600">{flight.destination}</p>
                              </div>
                            </div>
                            <div className="w-full md:w-1/3 text-right">
                              <p className="text-2xl font-bold text-blue-600 flex items-center justify-end">
                                <IndianRupee size={22} className="mr-1" />
                                {flight.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {isMultiStop && index < route.path.length - 1 && (
                      <div className="flex justify-start items-center my-4 ml-10">
                        <div className="text-center text-sm font-semibold text-slate-500 bg-slate-200 rounded-full px-4 py-2 border border-slate-300">
                          <p>Layover in {flight.destination}: {getLayoverDuration(flight.arrivalTime, route.path[index + 1].departureTime)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-700">No connecting route found.</h3>
        <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Modify Search</Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 sm:py-12 px-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center justify-center gap-2 sm:gap-4">
            <Sparkles className="text-amber-500" />
            <span>Smart Route from {source} to {destination}</span>
            <Sparkles className="text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">
            Cheapest route found using Dijkstra's Algorithm
          </p>
          {route?.totalPrice && (
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
              <IndianRupee size={24} />
              {route.totalPrice.toLocaleString()} <span className="text-base font-medium text-slate-500">total</span>
            </h2>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default SmartResultsPage;
