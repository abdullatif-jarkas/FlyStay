import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaApple,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import travelImage from "../../assets/Auth/travel-photo.png";

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex bg-white rounded-lg shadow-lg">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 p-10">
        <img
          src={travelImage}
          alt="Travel"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold mb-2">
            {type === "login" ? "Login" : "Register"}
          </h2>

          {type === "login" && (
            <p className="text-gray-600 mb-6">
              Login to access yourEasyset24 account
            </p>
          )}

          <form className="space-y-4">
            {type === "register" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1 font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Easyset24"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1 font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Easyset24"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Easyset24@Gmail.Com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••••"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {type === "register" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="••••••••••••"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            {type === "login" ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember" className="text-sm">
                    Remember Me
                  </label>
                </div>
                <Link
                  to="/auth/forgot-password"
                  className="text-primary-500 text-sm"
                >
                  Forgot Password?
                </Link>
              </div>
            ) : (
              <div className="flex items-center">
                <input type="checkbox" id="terms" className="mr-2" />
                <label htmlFor="terms" className="text-sm">
                  I agree to all the Terms and Privacy Policies
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-3 rounded-md hover:bg-primary-600 transition duration-300"
            >
              {type === "login" ? "Login" : "Register Now"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Or</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                <FaFacebook className="text-blue-600" />
              </button>
              <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                <FaApple className="text-black" />
              </button>
              <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                <FaGoogle className="text-red-500" />
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            {type === "login" ? (
              <p>
                Don't have an account in Easyset24 yet?{" "}
                <Link
                  to="/auth/register"
                  className="text-primary-500 font-medium"
                >
                  Register !
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link to="/auth/login" className="text-primary-500 font-medium">
                  Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
