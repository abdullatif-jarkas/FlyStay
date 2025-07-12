// Utility functions for flight data formatting and manipulation

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const calculateLayoverTime = (departureTime: string, arrivalTime: string): string => {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  const diffMinutes = Math.floor((arrival.getTime() - departure.getTime()) / (1000 * 60));
  return formatDuration(diffMinutes);
};

export const getStopsText = (stops: number): string => {
  if (stops === 0) return 'Direct';
  if (stops === 1) return '1 Stop';
  return `${stops} Stops`;
};

export const getFlightClassDisplayName = (flightClass: string): string => {
  const classNames: { [key: string]: string } = {
    'economy': 'Economy',
    'business': 'Business',
    'first': 'First Class'
  };
  return classNames[flightClass] || 'Economy';
};

export const getFlightClassBadgeColor = (flightClass: string): string => {
  const colors: { [key: string]: string } = {
    'economy': 'bg-blue-100 text-blue-800',
    'business': 'bg-purple-100 text-purple-800',
    'first': 'bg-yellow-100 text-yellow-800'
  };
  return colors[flightClass] || colors.economy;
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const calculateTotalPrice = (basePrice: number, passengers: { adults: number; children: number; infants: number }): number => {
  // Children typically pay 75% of adult price, infants pay 10%
  const adultPrice = basePrice;
  const childPrice = basePrice * 0.75;
  const infantPrice = basePrice * 0.1;
  
  return (passengers.adults * adultPrice) + 
         (passengers.children * childPrice) + 
         (passengers.infants * infantPrice);
};

export const isFlightDepartureSoon = (departureTime: string, hoursThreshold: number = 24): boolean => {
  const departure = new Date(departureTime);
  const now = new Date();
  const diffHours = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours <= hoursThreshold && diffHours > 0;
};

export const getFlightStatus = (departureTime: string, arrivalTime: string): 'upcoming' | 'boarding' | 'departed' | 'arrived' => {
  const now = new Date();
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  
  if (now < departure) {
    // Check if boarding (typically 30 minutes before departure)
    const boardingTime = new Date(departure.getTime() - 30 * 60 * 1000);
    return now >= boardingTime ? 'boarding' : 'upcoming';
  } else if (now >= departure && now < arrival) {
    return 'departed';
  } else {
    return 'arrived';
  }
};

export const sortFlights = (flights: any[], sortBy: string): any[] => {
  const sorted = [...flights];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'duration_asc':
      return sorted.sort((a, b) => a.duration_minutes - b.duration_minutes);
    case 'duration_desc':
      return sorted.sort((a, b) => b.duration_minutes - a.duration_minutes);
    case 'departure_time_asc':
      return sorted.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());
    case 'departure_time_desc':
      return sorted.sort((a, b) => new Date(b.departure_time).getTime() - new Date(a.departure_time).getTime());
    case 'arrival_time_asc':
      return sorted.sort((a, b) => new Date(a.arrival_time).getTime() - new Date(b.arrival_time).getTime());
    case 'arrival_time_desc':
      return sorted.sort((a, b) => new Date(b.arrival_time).getTime() - new Date(a.arrival_time).getTime());
    default:
      return sorted;
  }
};

export const filterFlights = (flights: any[], filters: any): any[] => {
  return flights.filter(flight => {
    // Price filter
    if (flight.price < filters.price_range.min || flight.price > filters.price_range.max) {
      return false;
    }
    
    // Airlines filter
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }
    
    // Stops filter
    if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
      return false;
    }
    
    // Duration filter
    if (flight.duration_minutes < filters.duration_range.min || 
        flight.duration_minutes > filters.duration_range.max) {
      return false;
    }
    
    // Departure time filter
    const departureTime = formatTime(flight.departure_time);
    if (departureTime < filters.departure_time_range.start || 
        departureTime > filters.departure_time_range.end) {
      return false;
    }
    
    // Arrival time filter
    const arrivalTime = formatTime(flight.arrival_time);
    if (arrivalTime < filters.arrival_time_range.start || 
        arrivalTime > filters.arrival_time_range.end) {
      return false;
    }
    
    // Aircraft types filter
    if (filters.aircraft_types.length > 0 && 
        flight.aircraft_type && 
        !filters.aircraft_types.includes(flight.aircraft_type)) {
      return false;
    }
    
    return true;
  });
};

export const generateFlightSearchUrl = (params: any): string => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      if (typeof params[key] === 'object') {
        searchParams.append(key, JSON.stringify(params[key]));
      } else {
        searchParams.append(key, params[key].toString());
      }
    }
  });
  
  return `/flight/search?${searchParams.toString()}`;
};

export const parseFlightSearchUrl = (searchString: string): any => {
  const params = new URLSearchParams(searchString);
  const result: any = {};
  
  for (const [key, value] of params.entries()) {
    try {
      // Try to parse as JSON first (for objects)
      result[key] = JSON.parse(value);
    } catch {
      // If not JSON, use as string
      result[key] = value;
    }
  }
  
  return result;
};

export const getAirportDisplayName = (airport: any): string => {
  return `${airport.city.name} (${airport.IATA_code})`;
};

export const getFlightRouteText = (flight: any): string => {
  const origin = getAirportDisplayName(flight.departure_airport);
  const destination = getAirportDisplayName(flight.arrival_airport);
  return `${origin} → ${destination}`;
};

export const isValidFlightSearch = (params: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!params.origin || params.origin.trim() === '') {
    errors.push('Origin is required');
  }
  
  if (!params.destination || params.destination.trim() === '') {
    errors.push('Destination is required');
  }
  
  if (!params.departure_date) {
    errors.push('Departure date is required');
  }
  
  if (params.trip_type === 'round-trip' && !params.return_date) {
    errors.push('Return date is required for round-trip flights');
  }
  
  if (params.departure_date && params.return_date) {
    const departure = new Date(params.departure_date);
    const returnDate = new Date(params.return_date);
    
    if (returnDate <= departure) {
      errors.push('Return date must be after departure date');
    }
  }
  
  if (!params.passengers || 
      !params.passengers.adults || 
      params.passengers.adults < 1) {
    errors.push('At least one adult passenger is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
