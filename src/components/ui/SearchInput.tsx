import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

// Define placeholder phrases with their corresponding navigation routes
const placeholderPhrases = [
  { text: "Book a flight now", route: "/flight", type: "flight" },
  { text: "Book a room", route: "/hotel", type: "hotel" },
  { text: "Find your perfect hotel", route: "/hotel", type: "hotel" },
  { text: "Search for flights", route: "/flight", type: "flight" },
  { text: "Discover amazing destinations", route: "/hotel", type: "hotel" },
  { text: "Explore flight deals", route: "/flight", type: "flight" },
  { text: "Find luxury hotels", route: "/hotel", type: "hotel" },
  { text: "Book your next adventure", route: "/flight", type: "flight" },
];

const SearchInput = () => {
  const navigate = useNavigate();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Rotate placeholder text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      // After a short animation delay, change the text
      setTimeout(() => {
        setCurrentPhraseIndex(
          (prevIndex) => (prevIndex + 1) % placeholderPhrases.length
        );
        setIsAnimating(false);
      }, 150); // Short fade duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle input click - navigate based on current placeholder
  const handleInputClick = () => {
    const currentPhrase = placeholderPhrases[currentPhraseIndex];
    navigate(currentPhrase.route);
  };

  // Handle search icon click - same navigation logic
  const handleSearchClick = () => {
    const currentPhrase = placeholderPhrases[currentPhraseIndex];
    navigate(currentPhrase.route);
  };

  const currentPlaceholder = placeholderPhrases[currentPhraseIndex].text;

  return (
    <div className="flex items-center border border-gray-border rounded-4 grow max-w-[605px] justify-between px-4 py-2 cursor-pointer hover:border-primary-500 transition-colors duration-200">
      <input
        type="search"
        className={`grow outline-0 font-bold text-xs cursor-pointer transition-opacity duration-150 ${
          isAnimating ? "opacity-50" : "opacity-100"
        }`}
        placeholder={currentPlaceholder}
        onClick={handleInputClick}
        readOnly
        name=""
        id=""
      />
      <CiSearch
        className="cursor-pointer hover:text-primary-500 transition-colors duration-200"
        onClick={handleSearchClick}
      />
    </div>
  );
};

export default SearchInput;
