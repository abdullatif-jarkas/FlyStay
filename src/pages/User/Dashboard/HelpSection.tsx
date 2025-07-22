// import { UserData } from "../../../hooks/useUser";
import { FiMessageCircle, FiPhone, FiMail, FiHelpCircle, FiBook, FiSearch } from "react-icons/fi";

// interface HelpSectionProps {
//   user: UserData;
// }

const HelpSection = () => {
  const helpTopics = [
    {
      title: "Booking & Reservations",
      description: "Help with making, modifying, or canceling bookings",
      icon: FiBook
    },
    {
      title: "Payment Issues",
      description: "Questions about payments, refunds, and billing",
      icon: FiMail
    },
    {
      title: "Account Management",
      description: "Managing your profile, preferences, and settings",
      icon: FiHelpCircle
    },
    {
      title: "Travel Support",
      description: "Assistance during your trip and travel-related queries",
      icon: FiPhone
    }
  ];

  const faqs = [
    {
      question: "How do I cancel my booking?",
      answer: "You can cancel your booking by going to your reservations and clicking the cancel button. Cancellation policies vary by property."
    },
    {
      question: "When will I be charged for my reservation?",
      answer: "Charging policies depend on the property and rate you select. Some properties charge immediately, while others charge at check-in."
    },
    {
      question: "How do I modify my booking?",
      answer: "You can modify your booking by visiting your reservations page and selecting the modify option, subject to availability and property policies."
    },
    {
      question: "What if I need special assistance?",
      answer: "Please contact our customer service team who can help arrange special assistance for your travel needs."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Contact Support Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiMessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-600">Available 24/7</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiPhone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Phone Support</h3>
              <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiMail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Email Support</h3>
              <p className="text-sm text-gray-600">support@flystay.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Topics Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Help Topics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helpTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Help Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Search Help Center</h2>
        
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">{faq.question}</h3>
              </button>
              <div className="px-4 pb-4">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All FAQs
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
