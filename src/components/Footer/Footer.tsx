import {
  FaLinkedin,
  FaTelegram,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import {
  SiVisa,
  SiAmericanexpress,
  SiMastercard,
  SiPaypal,
} from "react-icons/si";
import { FiMail } from "react-icons/fi";
import { FaLocationDot, FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineCopyright } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-white w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* About Us */}
          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Work With Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Press & Media
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Privacy & Security
                </a>
              </li>
            </ul>
          </div>

          {/* We Offer */}
          <div>
            <h3 className="font-bold mb-4">We Offer</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Trip Sponsorship
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Last Minutes Flights
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Best Deals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  AI-Driven Search
                </a>
              </li>
            </ul>
          </div>

          {/* Headquarters */}
          <div>
            <h3 className="font-bold mb-4">Headquarters</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  England
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  France
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Canada
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Iceland
                </a>
              </li>
            </ul>
          </div>

          {/* Travel Blogs */}
          <div>
            <h3 className="font-bold mb-4">Travel Blogs</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Bali Travel Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Sri Travel Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Peru Travel Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Swiss Travel Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Activities */}
          <div>
            <h3 className="font-bold mb-4">Activities</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Tour Leading
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Cruising & Sailing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Camping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Kayaking
                </a>
              </li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <h3 className="font-bold mb-4">Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Report Error
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Ask Online
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500">
                  Travel Insurance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods and Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <SiVisa className="text-3xl text-primary-500" />
            <SiAmericanexpress className="text-3xl text-primary-500" />
            <SiMastercard className="text-3xl text-primary-500" />
            <SiPaypal className="text-3xl text-primary-500" />
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Email</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="px-4 py-2 outline-none"
              />
              <button className="bg-primary-500 hover:bg-primary-600 cursor-pointer transition text-white px-4 py-2">
                Subscribe
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-blue-600 hover:text-primary-500 transition"
            >
              <FaLinkedin className="text-xl" />
            </a>
            <a
              href="#"
              className="text-blue-400 hover:text-primary-500 transition"
            >
              <FaTelegram className="text-xl" />
            </a>
            <a
              href="#"
              className="text-blue-400 hover:text-primary-500 transition"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              href="#"
              className="text-blue-600 hover:text-primary-500 transition"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a
              href="#"
              className="text-pink-600 hover:text-primary-500 transition"
            >
              <FaInstagram className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
          <div className="flex items-center mb-2 md:mb-0">
            <AiOutlineCopyright className="mr-1" /> Copyright FlyStay
            <span className="mx-4">|</span>
            <FiMail className="mr-1" /> flystay@gmail.com
          </div>
          <div className="text-center md:text-left mb-2 md:mb-0 flex items-center gap-0.5 group">
            <sub>
              <FaQuoteLeft />
            </sub>
            <span className="transition-all duration-500 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-[length:200%_200%] bg-clip-text text-transparent group-hover:animate-gradient">
              FlyStay: Seamless Journeys, Unrivalled Travel Wisdom!
            </span>
            <sup>
              <FaQuoteRight />
            </sup>
          </div>
          
          <div className="flex items-center">
            <FaLocationDot className="mr-1" /> 123 Oxford Street,London
            <span className="mx-4">|</span>
            <BsTelephone className="mr-1" /> +44 20 7123 4567
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
