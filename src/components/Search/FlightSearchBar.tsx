import { useState, useEffect } from 'react';
import { 
  FaPlane, 
  FaCalendarAlt, 
  FaUserFriends, 
  FaChevronDown, 
  FaSearch,
  FaExchangeAlt
} from 'react-icons/fa';
import { 
  FlightSearchBarProps, 
  FlightSearchParams, 
  Airport,
  TRIP_TYPES,
  FLIGHT_CLASSES
} from '../../types/flight';
import axios from 'axios';

const FlightSearchBar: React.FC<FlightSearchBarProps> = ({
  onSearch,
  loading = false,
  initialValues = {}
}) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    origin: initialValues.origin || '',
    destination: initialValues.destination || '',
    departure_date: initialValues.departure_date || '',
    return_date: initialValues.return_date || '',
    trip_type: initialValues.trip_type || 'round-trip',
    passengers: initialValues.passengers || {
      adults: 1,
      children: 0,
      infants: 0
    },
    flight_class: initialValues.flight_class || 'economy'
  });

  const [airports, setAirports] = useState<Airport[]>([]);
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  // Fetch airports on component mount
  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get-all-airports');
      if (response.data.status === 'success') {
        setAirports(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch airports:', error);
    }
  };

  const handleInputChange = (field: keyof FlightSearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePassengerChange = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setSearchParams(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: increment 
          ? prev.passengers[type] + 1 
          : Math.max(type === 'adults' ? 1 : 0, prev.passengers[type] - 1)
      }
    }));
  };

  const handleOriginSearch = (value: string) => {
    handleInputChange('origin', value);
    if (value.length >= 2) {
      const filtered = airports.filter(airport => 
        airport.name.toLowerCase().includes(value.toLowerCase()) ||
        airport.IATA_code.toLowerCase().includes(value.toLowerCase()) ||
        airport.city.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setOriginSuggestions(filtered);
      setShowOriginSuggestions(true);
    } else {
      setShowOriginSuggestions(false);
    }
  };

  const handleDestinationSearch = (value: string) => {
    handleInputChange('destination', value);
    if (value.length >= 2) {
      const filtered = airports.filter(airport => 
        airport.name.toLowerCase().includes(value.toLowerCase()) ||
        airport.IATA_code.toLowerCase().includes(value.toLowerCase()) ||
        airport.city.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setDestinationSuggestions(filtered);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const selectAirport = (airport: Airport, type: 'origin' | 'destination') => {
    const displayValue = `${airport.city.name} (${airport.IATA_code})`;
    if (type === 'origin') {
      handleInputChange('origin', displayValue);
      setShowOriginSuggestions(false);
    } else {
      handleInputChange('destination', displayValue);
      setShowDestinationSuggestions(false);
    }
  };

  const swapOriginDestination = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  // const getTotalPassengers = () => {
  //   return searchParams.passengers.adults + searchParams.passengers.children + searchParams.passengers.infants;
  // };

  const getPassengerText = () => {
    const { adults, children, infants } = searchParams.passengers;
    const parts = [];
    if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Trip Type Selector */}
      <div className="mb-4">
        <div className="flex gap-4">
          {/* {TRIP_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="trip_type"
                value={type.value}
                checked={searchParams.trip_type === type.value}
                onChange={(e) => handleInputChange('trip_type', e.target.value)}
                className="text-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">{type.label}</span>
            </label>
          ))} */}
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Origin */}
        <div className="flex-1 border-r border-gray-200 relative">
          <div className="flex items-center h-full px-4 py-4">
            <FaPlane className="text-primary-500 mr-3 transform -rotate-45" />
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">From</label>
              <input
                type="text"
                placeholder="Origin city or airport"
                className="w-full outline-none text-sm font-medium"
                value={searchParams.origin}
                onChange={(e) => handleOriginSearch(e.target.value)}
                onFocus={() => searchParams.origin.length >= 2 && setShowOriginSuggestions(true)}
              />
            </div>
          </div>
          
          {/* Origin Suggestions */}
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-20 border border-gray-200 max-h-60 overflow-y-auto">
              {originSuggestions.map((airport) => (
                <div
                  key={airport.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => selectAirport(airport, 'origin')}
                >
                  <div className="font-medium text-sm">{airport.city.name}</div>
                  <div className="text-xs text-gray-500">{airport.name} ({airport.IATA_code})</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center px-2 bg-gray-50">
          <button
            type="button"
            onClick={swapOriginDestination}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FaExchangeAlt className="text-primary-500" />
          </button>
        </div>

        {/* Destination */}
        <div className="flex-1 border-r border-gray-200 relative">
          <div className="flex items-center h-full px-4 py-4">
            <FaPlane className="text-primary-500 mr-3 transform rotate-45" />
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">To</label>
              <input
                type="text"
                placeholder="Destination city or airport"
                className="w-full outline-none text-sm font-medium"
                value={searchParams.destination}
                onChange={(e) => handleDestinationSearch(e.target.value)}
                onFocus={() => searchParams.destination.length >= 2 && setShowDestinationSuggestions(true)}
              />
            </div>
          </div>
          
          {/* Destination Suggestions */}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-20 border border-gray-200 max-h-60 overflow-y-auto">
              {destinationSuggestions.map((airport) => (
                <div
                  key={airport.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => selectAirport(airport, 'destination')}
                >
                  <div className="font-medium text-sm">{airport.city.name}</div>
                  <div className="text-xs text-gray-500">{airport.name} ({airport.IATA_code})</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="flex-1 border-r border-gray-200">
          <div className="flex items-center h-full px-4 py-4">
            <FaCalendarAlt className="text-primary-500 mr-3" />
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Departure</label>
              <input
                type="date"
                className="w-full outline-none text-sm font-medium"
                value={searchParams.departure_date}
                onChange={(e) => handleInputChange('departure_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Return Date (only for round-trip) */}
        {searchParams.trip_type === 'round-trip' && (
          <div className="flex-1 border-r border-gray-200">
            <div className="flex items-center h-full px-4 py-4">
              <FaCalendarAlt className="text-primary-500 mr-3" />
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Return</label>
                <input
                  type="date"
                  className="w-full outline-none text-sm font-medium"
                  value={searchParams.return_date}
                  onChange={(e) => handleInputChange('return_date', e.target.value)}
                  min={searchParams.departure_date || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Passengers & Class */}
        <div className="flex-1 border-r border-gray-200 relative">
          <div 
            className="flex items-center h-full px-4 py-4 cursor-pointer"
            onClick={() => setIsPassengersOpen(!isPassengersOpen)}
          >
            <FaUserFriends className="text-primary-500 mr-3" />
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Passengers & Class</label>
              <div className="text-sm font-medium">{getPassengerText()}</div>
              <div className="text-xs text-gray-500 capitalize">{searchParams.flight_class}</div>
            </div>
            <FaChevronDown className={`transition-transform ${isPassengersOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Passengers Dropdown */}
          {isPassengersOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-20 p-4 border border-gray-200">
              {/* Passengers */}
              <div className="space-y-4 mb-4">
                {[
                  { key: 'adults', label: 'Adults', min: 1 },
                  { key: 'children', label: 'Children (2-11)', min: 0 },
                  { key: 'infants', label: 'Infants (0-2)', min: 0 }
                ].map(({ key, label, min }) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm">{label}</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        type="button"
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        onClick={() => handlePassengerChange(key as any, false)}
                        disabled={searchParams.passengers[key as keyof typeof searchParams.passengers] <= min}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">
                        {searchParams.passengers[key as keyof typeof searchParams.passengers]}
                      </span>
                      <button 
                        type="button"
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        onClick={() => handlePassengerChange(key as any, true)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Flight Class */}
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">Flight Class</label>
                <select
                  value={searchParams.flight_class}
                  onChange={(e) => handleInputChange('flight_class', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {FLIGHT_CLASSES.map((cls) => (
                    <option key={cls.value} value={cls.value}>{cls.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSearch className="mr-2" />
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
};

export default FlightSearchBar;
