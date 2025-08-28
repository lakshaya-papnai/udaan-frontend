import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import Seat from '../components/Seat';
import api from '../api'; 
import LoadingSpinner from '../components/LoadingSpinner';
import { IndianRupee, LogIn } from 'lucide-react';
import bgImage from '../assets/splash-screen-img.png'; 

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const SeatSelectionPage = () => {
  const [flight, setFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); 
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const { data } = await api.get(`/flights/${id}`);
        setFlight(data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        setError('Could not load flight details. Please try again.');
      }
    };
    fetchFlight();
  }, [id]);

  useEffect(() => {
    socket.on('seatBooked', ({ flightId, seatNumber }) => {
      if (flightId === id) {
        setFlight((prevFlight) => {
          if (!prevFlight) return null;
          return {
            ...prevFlight,
            seats: prevFlight.seats.map((seat) =>
              seat.seatNumber === seatNumber ? { ...seat, isBooked: true } : seat
            ),
          };
        });
        if (selectedSeat === seatNumber) setSelectedSeat(null);
      }
    });
    return () => socket.off('seatBooked');
  }, [id, selectedSeat]);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeat === seatNumber) {
      setSelectedSeat(null); // Unselect if the same seat is clicked again
    } else {
      setSelectedSeat(seatNumber); // Select the new seat
    }
  };

  const handleBookSeat = async () => {
    if (!selectedSeat) return;
    if (!user) {
      setShowLoginPrompt(true); // Show the login prompt instead of redirecting
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/bookings', { flightId: id, seatNumber: selectedSeat }, config);
      navigate('/success');
    } catch (error) {
      setError(`Failed to book seat: ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  if (!flight && !error) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100"><LoadingSpinner /></div>;
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-center px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Go Home</button>
      </div>
    );
  }

  const seatRows = [];
  const seatsByRow = flight.seats.reduce((acc, seat) => {
    const rowNumber = seat.seatNumber.match(/\d+/)[0];
    if (!acc[rowNumber]) acc[rowNumber] = [];
    acc[rowNumber].push(seat);
    return acc;
  }, {});
  seatRows.push(...Object.values(seatsByRow));

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12" style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Authentication Required</h2>
            <p className="text-slate-600 mb-6">Please log in or create an account to complete your booking.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowLoginPrompt(false)} className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100">
                Cancel
              </button>
              <Link to="/login" state={{ from: `/book/${id}` }} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
                <LogIn size={18} /> Login
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 mb-8 lg:mb-0">
           <div className="lg:sticky top-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-200/50">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Select Your Seat</h1>
              <p className="text-base sm:text-lg text-slate-600">{flight.airline} - {flight.flightNumber}</p>
              <p className="text-sm sm:text-base text-slate-500">{flight.source} → {flight.destination}</p>
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold text-slate-700 mb-4">1, Adult</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><div className="w-6 h-8 rounded bg-slate-200 border border-slate-400"></div><span className="text-slate-600">Available</span></div>
                  <div className="flex items-center gap-3"><div className="w-6 h-8 rounded bg-green-500 border border-green-700"></div><span className="text-slate-600">Selected</span></div>
                  <div className="flex items-center gap-3"><div className="w-6 h-8 rounded bg-red-400 border border-red-500"></div><span className="text-slate-600">Booked</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Seat Map */}
        <div className="lg:col-span-3">
          <div className="relative max-w-sm mx-auto">
            <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl border border-slate-200 rounded-2xl">
              <div className="pt-10 pb-6 px-2 sm:px-4">
                {/* Business Class */}
                <div className="mb-3">
                  <div className="text-center mb-2"><span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wider">BUSINESS</span></div>
                  <div className="bg-blue-50/50 rounded-lg p-2 border border-blue-200 space-y-1.5">
                    {seatRows.slice(0, 2).map((row, rowIndex) => (
                      <div key={rowIndex} className="flex items-center justify-center gap-2 sm:gap-4">
                        <div className="flex gap-1 sm:gap-1.5">{row.slice(0, 2).map(seat => <Seat key={seat.seatNumber} {...seat} isSelected={selectedSeat === seat.seatNumber} onClick={() => handleSeatClick(seat.seatNumber)} />)}</div>
                        <div className="w-4 sm:w-6"></div>
                        <div className="flex gap-1 sm:gap-1.5">{row.slice(2, 4).map(seat => <Seat key={seat.seatNumber} {...seat} isSelected={selectedSeat === seat.seatNumber} onClick={() => handleSeatClick(seat.seatNumber)} />)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Economy Class */}
                <div>
                  <div className="text-center mb-2"><span className="bg-slate-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wider">ECONOMY</span></div>
                  <div className="bg-slate-50/50 rounded-lg p-2 border border-slate-200 space-y-1">
                    {seatRows.slice(2, 8).map((row, rowIndex) => (
                      <div key={rowIndex + 2} className="flex items-center justify-center gap-2 sm:gap-4">
                        <div className="flex gap-1 sm:gap-1.5">{row.slice(0, 2).map(seat => <Seat key={seat.seatNumber} {...seat} isSelected={selectedSeat === seat.seatNumber} onClick={() => handleSeatClick(seat.seatNumber)} />)}</div>
                        <div className="w-4 sm:w-6"></div>
                        <div className="flex gap-1 sm:gap-1.5">{row.slice(2, 4).map(seat => <Seat key={seat.seatNumber} {...seat} isSelected={selectedSeat === seat.seatNumber} onClick={() => handleSeatClick(seat.seatNumber)} />)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Footer */}
      {selectedSeat && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 shadow-2xl">
          <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="font-bold text-slate-800 text-lg">Selected Seat: {selectedSeat}</p>
              <p className="text-slate-600 flex items-center justify-center sm:justify-start"><IndianRupee size={16} className="mr-1"/>{flight.price.toLocaleString()} (Total Price)</p>
            </div>
            <button onClick={handleBookSeat} className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg">
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
