import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import travelImage from "../../assets/Auth/travel-photo.png";
import { AuthFormProps } from "../../types/components/Auth/Authform";
import { useAuth } from "../../hooks/useAuth";
import { BarLoader } from "react-spinners";

const AuthForm = ({ type }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const { handleLogin, handleRegister, handleGoogleRedirect, loading } =
    useAuth();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "login") {
      await handleLogin(formData.email, formData.password);
      if (rememberMe) {
        localStorage.setItem("rememberEmail", formData.email);
        localStorage.setItem("rememberPassword", formData.password); // ⚠️ أقل أمانًا
      } else {
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      }
    } else {
      await handleRegister(formData);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");

    if (savedEmail && savedPassword) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        password: savedPassword,
      }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="flex bg-white rounded-lg shadow-lg">
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
          <h2 className="text-3xl font-bold mb-2">
            {type === "login" ? "Login" : "Register"}
          </h2>

          {type === "login" && (
            <p className="text-gray-600 mb-6">
              Login to access your Easyset24 account
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {type === "register" && (
              <>
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Easyset24"
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone_number"
                    className="block mb-1 font-medium"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    placeholder="0987654321"
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Easyset24@Gmail.Com"
                className="w-full p-3 border rounded-md"
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••••••"
                  className="w-full p-3 border rounded-md"
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
                    id="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password_confirmation: e.target.value,
                      })
                    }
                    placeholder="••••••••••••"
                    className="w-full p-3 border rounded-md"
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
            )}

            {type === "login" ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2"
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
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
                <input type="checkbox" id="terms" className="mr-2" required />
                <label htmlFor="terms" className="text-sm">
                  I agree to all the Terms and Privacy Policies
                </label>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 min-h-12 rounded-md flex justify-center items-center gap-2 hover:bg-primary-600 transition duration-300"
            >
              {loading ? (
                <>
                  <BarLoader color="#ffffff" width="50%" />
                </>
              ) : type === "login" ? (
                "Login"
              ) : (
                "Register Now"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Or</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                type="button"
                onClick={handleGoogleRedirect}
                className="w-full flex justify-center items-center py-3 border rounded-md"
              >
                <FaGoogle className="text-red-500 mr-2" />
                Continue with Google
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
                  Register!
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
