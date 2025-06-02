import { NavLink } from "react-router-dom";

interface ButtonProps {
  title?: string;
  to?: string;
  styles?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Button = ({ title, to, styles, onClick, children }: ButtonProps) => {
  if (to) {
    return (
      <NavLink
        className={({ isActive }) =>
          `${
            styles ? styles : ""
          } text-center font-medium text-gray-button rounded-4 w-[189px] py-[9px] ${
            isActive ? "bg-primary-500 border-0 text-white font-bold" : ""
          }`
        }
        to={to}
      >
        {title || children}
      </NavLink>
    );
  }

  return (
    <button
      className={`${
        styles ? styles : ""
      } text-center font-medium text-gray-button rounded-4 w-[189px] py-[9px]
        `}
      onClick={onClick}
    >
      {title || children}
    </button>
  );
};

export default Button;
// className={({ isActive }) =>
//         `${styles ? styles : ""} text-center font-medium text-gray-button rounded-4 w-[189px] py-[9px] ${
//           isActive ? "bg-primary-500 border-0 text-white font-bold" : ""
//         }`
