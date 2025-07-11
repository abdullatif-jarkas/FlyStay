import { useState } from 'react';
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from 'react-icons/fa';
import { BsFullscreen } from 'react-icons/bs';

interface TourCardProps {
  id: string;
  image: string;
  title: string;
  location?: string;
  dateRange?: string;
  description?: string;
  rating?: number;
}

const TourCard = ({ 
  id, 
  image, 
  title, 
  location, 
  dateRange, 
  description,
  rating = 0
}: TourCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      {/* Image container with overlay icons */}
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        
        {/* Favorite button */}
        <button 
          onClick={toggleFavorite}
          className="absolute top-2 left-2 p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-white" />
          )}
        </button>
        
        {/* Rating stars */}
        <div className="absolute bottom-2 left-2 flex">
          {rating && [1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
              {star <= rating ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-white" />
              )}
            </span>
          ))}
        </div>
        
        {/* Fullscreen button */}
        {/* <button className="absolute bottom-2 right-2 p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
          <BsFullscreen className="text-white" />
        </button> */}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-500 uppercase text-sm">{location}</p>
        
        <div className="my-2">
          <p className="text-sm font-medium">{dateRange}</p>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default TourCard;