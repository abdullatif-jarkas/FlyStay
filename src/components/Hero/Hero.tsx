
import HotelSearchBar from '../Search/HotelSearchBar';
import heroBackground from '../../assets/Hero/Landing Page Banner.png';

const Hero = () => {
  return (
    <div className="relative">
      {/* Hero background with image */}
      <div 
        className="w-full h-[500px] relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        {/* Content container */}
        <div className="container mx-auto px-4 h-full relative z-10">
          {/* Left-aligned text */}
          <div className="flex h-full items-center">
            <div className="max-w-lg text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Your Perfect Stay
              </h1>
              <p className="text-xl text-white mb-8">
                Search deals on hotels, homes, and much more...
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search bar positioned at the bottom of the hero */}
      <div className="container mx-auto px-4 relative">
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2">
          <HotelSearchBar />
        </div>
      </div>
      
      {/* Spacer to push content below the search bar */}
      <div className="h-20"></div>
    </div>
  );
};

export default Hero;
