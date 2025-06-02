import { useParams } from 'react-router-dom';

const HotelPayment = () => {
  const { hotelId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payment Details</h1>
      <p>Hotel ID: {hotelId}</p>
      {/* Add your payment form and details here */}
    </div>
  );
};

export default HotelPayment;