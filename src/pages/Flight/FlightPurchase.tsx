import { useParams } from 'react-router-dom';

const FlightPurchase = () => {
  const { flightId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Flight Purchase</h1>
      <p>Flight ID: {flightId}</p>
      {/* Add your flight purchase form and details here */}
    </div>
  );
};

export default FlightPurchase;