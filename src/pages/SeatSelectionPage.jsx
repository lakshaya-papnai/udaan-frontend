import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api'; // USE OUR CORRECT API HELPER
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import Seat from '../components/Seat';
import LoadingSpinner from '../components/LoadingSpinner';
import { IndianRupee, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
import bgImage from '../assets/splash-screen-img.png';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const SeatSelectionPage = () => {
  const [flight, setFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        // Use the api helper here too
        const { data } = await api.get(`/flights/${id}`);
        setFlight(data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        toast.error('Could not load flight details.');
      }
    };
    fetchFlight();
  }, [id]);

  useEffect(() => {
    socket.on('seatBooked', ({ flightId, seatNumber }) => {
      if (flightId === id) {
        toast.info(`Seat ${seatNumber} was just booked by another user!`);
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
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seatNumber);
    }
  };

  const handleBookSeat = async () => {
    if (!selectedSeat) {
      toast.warn('Please select a seat first.');
      return;
    }
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    toast.promise(
      // THE FIX IS HERE: Use the 'api' helper for the POST request
      api.post(
        '/bookings', // The URL is now just '/bookings'
        { flightId: id, seatNumber: selectedSeat },
        { headers: { Authorization: `Bearer ${user.token}` } }
      ),
      {
        pending: 'Confirming your booking...',
        success: {
          render(){
            navigate('/success');
            return 'Booking confirmed!';
          }
        },
        error: {
          render({ data }){
            return data.response?.data?.message || 'Booking failed. Please try again.';
          }
        }
      }
    );
  };

  if (!flight) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100"><LoadingSpinner /></div>;
  }

  // ... the rest of your component code is perfect and does not need to change ...
  const seatRows = [];
  const seatsByRow = flight.seats.reduce((acc, seat) => {
    const rowNumber = seat.seatNumber.match(/\d+/)[0];
    if (!acc[rowNumber]) acc[rowNumber] = [];
    acc[rowNumber].push(seat);
    return acc;
  }, {});
  seatRows.push(...Object.values(seatsByRow));

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Authentication Required</h2>
            <p className="text-slate-600 mb-6">Please log in to complete your booking.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowLoginPrompt(false)} className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100">Cancel</button>
              <Link to="/login" state={{ from: `/book/${id}` }} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"><LogIn size={18} /> Login</Link>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-1 mb-8 lg:mb-0">
          <div className="sticky top-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200/50">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Select Your Seat</h1>
              <p className="text-lg text-slate-600">{flight.airline} - {flight.flightNumber}</p>
              <p className="text-slate-500">{flight.source} → {flight.destination}</p>
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
        <div className="lg:col-span-3">
          <div className="relative max-w-sm mx-auto">
            <div className="relative bg-white shadow-2xl border border-slate-200 rounded-2xl">
              <div className="pt-10 pb-6 px-4">
                <div className="mb-3">
                  <div className="text-center mb-2"><span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wider">BUSINESS</span></div>
                  <div className="bg-blue-50/50 rounded-lg p-2 border border-blue-200 space-y-1.5">
                    {seatRows.slice(0, 2).map((row, rowIndex) => (
                      <div key={rowIndex} className="flex items-center justify-center gap-4">
                        <div className="flex gap-1.5">{row.slice(0, 2).map(seat => <Seat key={seat.seatNumber} {...seat} isSelected={selectedSeat === seat.seatNumber} onClick={() => handleSeatClick(seat.seatNumber)} />)}</div>
                        <div className="w-6"></div>
                        <div className="flex gap-1.5">{row.slice(2, 4).map(seat => <Seat key={seat.seatNumber} {...seat} isSelected={selectedSeat === seat.seatNumber} onClick={() => handleSeatClick(seat.seatNumber)} />)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-center mb-2"><span className="bg-slate-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wider">ECONOMY</span></div>
                  <div className="bg-slate-50/50 rounded-lg p-2 border border-slate-200 space-y-1">
                    {seatRows.slice(2, 8).map((row, rowIndex) => (
                      <div key={rowIndex + 2} className="flex items-center justify-center gap-4">
                        <div className="flex gap-1.5">{row.slice(0, 2).map(seat => <Seat key={seat.seatNumber} {...seat} isSelected={selectedSeat === seat.seatNumber} onClick={() => handleSeatClick(seat.seatNumber)} />)}</div>
                        <div className="w-6"></div>
                        <div className="flex gap-1.5">{row.slice(2, 4).map(seat => <Seat key={seat.seatNumber} {...seat} isSelected={selectedSeat === seat.seatNumber} onClick={() => handleSeatClick(seat.seatNumber)} />)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
