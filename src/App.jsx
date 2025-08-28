import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import SmartResultsPage from './pages/SmartResultsPage';
import SuccessPage from './pages/SuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Import the ToastContainer and the CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
       <Navbar />
       <main className="flex-1 flex flex-col">
         <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="/results" element={<SearchResultsPage />} />
           <Route path="/login" element={<LoginPage />} />
           <Route path="/register" element={<RegisterPage />} />
           <Route path="/book/:id" element={<SeatSelectionPage />} />
           <Route path="/smart-results" element={<SmartResultsPage />} />
           <Route path="/success" element={<SuccessPage />} />
           <Route path="/my-bookings" element={<MyBookingsPage />} />
         </Routes>
       </main>
       <Footer />

       {/* ADD THE TOAST CONTAINER HERE */}
       <ToastContainer />
    </div>
  );
}

export default App;
