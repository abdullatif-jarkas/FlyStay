import { FaSpinner } from "react-icons/fa6";
import Logo from "./../../assets/Logo/Logo.png";

const LoadingSpinner = () => {
  return (
    <div className="fixed flex flex-col gap-4 items-center justify-center h-screen w-screen bg-white">
      <img src={Logo} alt="Loading..." className="animate-pulse" />
      <FaSpinner className="text-xl text-primary-500 animate-spin mb-4 mx-auto" />
    </div>
  );
};

export default LoadingSpinner;
