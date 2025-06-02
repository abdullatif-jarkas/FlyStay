import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import travelImage from '../../../assets/Auth/travel-photo.png';
import axios from 'axios';
import { toast } from 'sonner'; // تأكد أنك تستخدم toast من sonner

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:8000/api/forgot-password', { email });
      setEmailSent(true);
      toast.success("Reset link sent to your email.");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send reset email."
      );
    }
  };

  return (
    <div className="flex h-screen bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 p-10">
        <img 
          src={travelImage} 
          alt="Travel" 
          className="w-full h-full object-cover rounded-8"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Link to="/auth/login" className="flex items-center text-primary-500 mb-6">
            <FaArrowLeft className="mr-2" /> Back to Login
          </Link>
          
          <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
          <p className="text-gray-600 mb-6">
            {!emailSent 
              ? "Enter your email address and we'll send you a link to reset your password." 
              : "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."}
          </p>

          {!emailSent ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Easyset24@Gmail.Com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-3 rounded-md hover:bg-primary-600 transition duration-300"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full bg-primary-500 text-white py-3 rounded-md hover:bg-primary-600 transition duration-300"
              >
                Resend Email
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <p>
              Remember your password? <Link to="/auth/login" className="text-primary-500 font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
