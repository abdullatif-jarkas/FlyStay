import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaChevronDown, FaSearch } from 'react-icons/fa';

const HotelSearchBar = () => {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your search logic here
    console.log({
      destination,
      checkInDate,
      checkOutDate,
      adults,
      children,
      rooms
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row shadow-md rounded-md overflow-hidden">
        {/* Destination */}
        <div className="flex-1 border-r border-gray-200 bg-white">
          <div className="flex items-center h-full px-4 py-3">
            <FaMapMarkerAlt className="text-primary-500 mr-2" />
            <input
              type="text"
              placeholder="Where Are You Going To?"
              className="w-full outline-none text-sm"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        {/* Check-in/Check-out dates */}
        <div className="flex-1 border-r border-gray-200 bg-white">
          <div className="flex items-center h-full px-4 py-3">
            <FaCalendarAlt className="text-primary-500 mr-2" />
            <div className="flex flex-1 space-x-2">
              <input
                type="date"
                placeholder="Check In Date"
                className="w-1/2 outline-none text-sm"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
              <input
                type="date"
                placeholder="Check Out Date"
                className="w-1/2 outline-none text-sm"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 border-r border-gray-200 bg-white relative">
          <div 
            className="flex items-center h-full px-4 py-3 cursor-pointer"
            onClick={() => setIsGuestsOpen(!isGuestsOpen)}
          >
            <FaUserFriends className="text-primary-500 mr-2" />
            <div className="flex-1 flex justify-between items-center">
              <div className="text-sm">
                Adults {adults} · Children {children} · Room {rooms}
              </div>
              <FaChevronDown className={`transition-transform ${isGuestsOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Dropdown for guests */}
          {isGuestsOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-10 p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span>Adults</span>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  >
                    -
                  </button>
                  <span>{adults}</span>
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onClick={() => setAdults(adults + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span>Children</span>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  >
                    -
                  </button>
                  <span>{children}</span>
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onClick={() => setChildren(children + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Rooms</span>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                  >
                    -
                  </button>
                  <span>{rooms}</span>
                  <button 
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onClick={() => setRooms(rooms + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search button */}
        <button 
          type="submit" 
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 flex items-center justify-center transition-colors"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </form>
    </div>
  );
};

export default HotelSearchBar;