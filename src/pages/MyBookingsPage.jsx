import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Ticket, Plane, Clock } from 'lucide-react';
import api from '../api'; 

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        setError('You must be logged in to view your bookings.');
        return;
      }
      try {
        setLoading(true);
        setError(''); //Clear previous errors before fetching.
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get('/bookings/mybookings', config);
        setBookings(data);
      } catch (err) {
        setError('Could not fetch your bookings. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">My Bookings</h1>
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
        
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              booking.flight && (
                <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-slate-500">Booking ID: {booking._id}</p>
                        <h2 className="text-xl font-bold text-slate-800">{booking.flight.airline} - {booking.flight.flightNumber}</h2>
                        <p className="font-semibold text-blue-600">{booking.flight.source} → {booking.flight.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-slate-700">Seat: {booking.seatNumber}</p>
                        <p className="text-sm text-slate-500">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <Plane size={16} />
                        <span>Departure: {new Date(booking.flight.departureTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Arrival: {new Date(booking.flight.arrivalTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <Ticket size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">No Bookings Found</h3>
              <p className="text-slate-500 mt-2">You haven't booked any flights yet. Start searching now!</p>
              <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Search Flights
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
