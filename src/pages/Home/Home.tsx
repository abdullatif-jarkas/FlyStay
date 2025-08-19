import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBuilding,
  FaSearch,
  FaHeart,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaGlobe,
  FaArrowRight,
  FaCheckCircle,
  FaQuoteLeft,
} from "react-icons/fa";
import heroBackground from "../../assets/Home/Hero/Landing Page Banner.png";
import HotelSearchBar from "../../components/Search/HotelSearchBar";
import FlightSearchBar from "../../components/Search/FlightSearchBar";

// Types
interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
}

const Home = () => {
  const [activeSearchTab, setActiveSearchTab] = useState<"hotels" | "flights">(
    "hotels"
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services: Service[] = [
    {
      icon: <FaHotel className="text-3xl" />,
      title: "Hotel Booking",
      description:
        "Find and book the perfect accommodation from luxury resorts to budget-friendly stays worldwide.",
      link: "/hotel",
      color: "bg-blue-500",
    },
    {
      icon: <FaPlane className="text-3xl" />,
      title: "Flight Booking",
      description:
        "Search and compare flights from multiple airlines to get the best deals for your journey.",
      link: "/flight",
      color: "bg-green-500",
    },
  ];

  const features: Feature[] = [
    {
      icon: <FaSearch className="text-2xl text-primary-500" />,
      title: "Smart Search",
      description:
        "Advanced search filters to find exactly what you're looking for with ease.",
    },
    {
      icon: <FaShieldAlt className="text-2xl text-primary-500" />,
      title: "Secure Booking",
      description:
        "Your payments and personal information are protected with bank-level security.",
    },
    {
      icon: <FaHeart className="text-2xl text-primary-500" />,
      title: "Best Price Guarantee",
      description:
        "We guarantee the best prices. Find a lower price elsewhere? We'll match it.",
    },
    {
      icon: <FaGlobe className="text-2xl text-primary-500" />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to help you with any questions or issues.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Search & Compare",
      description:
        "Use our smart search to find and compare options that match your preferences and budget.",
      icon: <FaSearch className="text-2xl" />,
    },
    {
      number: "02",
      title: "Choose & Book",
      description:
        "Select your preferred option and complete your booking with our secure payment system.",
      icon: <FaCheckCircle className="text-2xl" />,
    },
    {
      number: "03",
      title: "Enjoy Your Trip",
      description:
        "Relax and enjoy your journey knowing everything is taken care of by FlyStay.",
      icon: <FaHeart className="text-2xl" />,
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      comment:
        "FlyStay made planning my European vacation so easy! Found amazing deals on both flights and hotels.",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Ahmed Hassan",
      location: "Dubai, UAE",
      rating: 5,
      comment:
        "Excellent service and great prices. The booking process was smooth and customer support was very helpful.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Maria Garcia",
      location: "Barcelona, Spain",
      rating: 5,
      comment:
        "I've used FlyStay for multiple trips now. Always reliable and offers the best deals in the market.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  const stats: Stat[] = [
    {
      number: "1M+",
      label: "Happy Customers",
      icon: <FaUsers className="text-2xl text-primary-500" />,
    },
    {
      number: "50K+",
      label: "Hotels Worldwide",
      icon: <FaHotel className="text-2xl text-primary-500" />,
    },
    {
      number: "500+",
      label: "Airlines Partners",
      icon: <FaPlane className="text-2xl text-primary-500" />,
    },
    {
      number: "24/7",
      label: "Customer Support",
      icon: <FaShieldAlt className="text-2xl text-primary-500" />,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div
          className="w-full h-[600px] relative bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Content */}
          <div className="container mx-auto px-4 h-full relative z-10">
            <div className="flex h-full items-center">
              <div
                className={`max-w-2xl text-left transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Your Journey Starts with{" "}
                  <span className="text-primary-400">FlyStay</span>
                </h1>
                <p className="text-xl text-white mb-8 leading-relaxed">
                  Discover amazing deals on flights and hotels.
                  Book with confidence and create unforgettable memories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/flight"
                    className="px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    <FaPlane />
                    Book Flights
                  </Link>
                  <Link
                    to="/hotel"
                    className="px-8 py-4 bg-white text-primary-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    <FaHotel />
                    Find Hotels
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="container mx-auto px-4 relative">
          <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2">
            <div className="bg-white rounded-lg shadow-xl p-6">
              {/* Search Tabs */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveSearchTab("hotels")}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeSearchTab === "hotels"
                      ? "bg-white text-primary-500 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <FaHotel />
                  Hotels
                </button>
                <button
                  onClick={() => setActiveSearchTab("flights")}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeSearchTab === "flights"
                      ? "bg-white text-primary-500 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <FaPlane />
                  Flights
                </button>
              </div>

              {/* Search Components */}
              {activeSearchTab === "hotels" ? (
                <HotelSearchBar />
              ) : (
                <FlightSearchBar
                  onSearch={(params) => {
                    // Navigate to flight search with params
                    window.location.href = `/flight?${new URLSearchParams({
                      origin: params.origin,
                      destination: params.destination,
                      departure_date: params.departure_date,
                      return_date: params.return_date || "",
                      trip_type: params.trip_type,
                      adults: params.passengers.adults.toString(),
                      children: params.passengers.children.toString(),
                      infants: params.passengers.infants.toString(),
                      flight_class: params.flight_class,
                    }).toString()}`;
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-32"></div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Perfect Trip
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From flights to accommodations, we've got you covered with our
              comprehensive travel booking platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 text-center gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 ${service.color} mx-auto rounded-lg flex items-center justify-center text-white mb-6`}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Link
                  to={service.link}
                  className="inline-flex items-center text-primary-500 font-semibold hover:text-primary-600 transition-colors"
                >
                  Explore Now
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FlyStay?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to making your travel experience seamless, secure,
              and memorable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Booking your perfect trip is easier than ever with our simple
              3-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Step Number */}
                <div className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-primary-200 transform translate-x-1/2"></div>
                )}

                <div className="relative z-10 bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary-500">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what real travelers have
              to say about FlyStay.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>

                <div className="relative">
                  <FaQuoteLeft className="absolute -top-2 -left-2 text-primary-200 text-2xl" />
                  <p className="text-gray-700 italic leading-relaxed pl-6">
                    "{testimonial.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Join millions of travelers who trust FlyStay for their booking
            needs. Start planning your next adventure today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/flight"
              className="px-8 py-4 bg-white text-primary-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              <FaPlane />
              Search Flights
            </Link>
            <Link
              to="/hotel"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-500 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              <FaHotel />
              Find Hotels
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
