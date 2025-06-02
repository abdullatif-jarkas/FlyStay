import { useParams } from 'react-router-dom';

const HotelInfo = () => {
  const { hotelId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hotel Information</h1>
      <p>Hotel ID: {hotelId}</p>
      {/* Add your hotel information content here */}
    </div>
  );
};

export default HotelInfo;