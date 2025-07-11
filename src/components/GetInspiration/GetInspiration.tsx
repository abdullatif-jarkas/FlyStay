
import getInspirationBackground from '../../assets/Home/get_inspiration_background.jpg';
import { RxTriangleRight } from 'react-icons/rx';

const GetInspiration = () => {
  return (
    <div className="relative">
      {/* Hero background with image */}
      <div 
        className="w-full h-[500px] relative bg-cover bg-center"
        style={{ backgroundImage: `url(${getInspirationBackground})` }}
      >
        {/* Overlay for better text readability */}
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Content container */}
        <div className="container mx-auto px-4 h-full relative z-10">
          {/* Left-aligned text */}
          <div className="flex flex-col gap-[87px] justify-center h-full">
            <div className=" text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Get Inspirations For Your Next Trip
              </h1>
              <p className="text-xl text-white mb-8">
                Read About Wonderful Adventure We Love Most
              </p>
            </div>
            <div className="flex flex-col items-end text-right">
              <h1 className="max-w-xl text-4xl md:text-5xl font-bold text-white mb-4">
                Difficult Roads Lead To Beautiful Destination .
              </h1>
              <p className="text-xl text-white mb-8 flex items-center cursor-pointer">
                Read More <RxTriangleRight />
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default GetInspiration;
