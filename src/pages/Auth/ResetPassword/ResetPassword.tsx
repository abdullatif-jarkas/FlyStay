import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import travelImage from '../../../assets/Auth/travel-photo.png';
import axios from '../../../api/axios';  // Use our configured axios instance
import { toast } from 'sonner';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    token: token || ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords don't match");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/reset-password', formData);
      toast.success("Password reset successfully");
      navigate('/auth/login');
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setLoading(false);
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
          
          <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-gray-600 mb-6">
            Enter your new password below to reset your account password.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="flystay@gmail.Com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••••••"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block mb-1 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                  placeholder="••••••••••••"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 rounded-md hover:bg-primary-600 transition duration-300"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
