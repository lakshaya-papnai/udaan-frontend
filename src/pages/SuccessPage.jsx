import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import bgImage from '../assets/splash-screen-img.png';

const SuccessPage = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 bg-white rounded-xl shadow-xl p-8 text-center max-w-md w-full">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Booking Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your flight seat has been confirmed. Check your email for the e-ticket and flight details.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
