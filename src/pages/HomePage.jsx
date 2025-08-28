import SearchForm from '../components/SearchForm';
import bgImage from '../assets/planebg2.jpeg';

const HomePage = () => {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start pt-24 sm:justify-center sm:pt-0" // Responsive vertical alignment
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" /> {/* Slightly darker for better contrast */}

      {/* Content container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="mb-8 sm:mb-12"> 
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-pink-100 mb-4 drop-shadow-lg">
            Find Your Perfect Flight
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-yellow-200 drop-shadow-md">
            Search and compare flights from hundreds of airlines worldwide
          </p>
        </div>
        <SearchForm />
      </div>
    </div>
  );
};

export default HomePage;
