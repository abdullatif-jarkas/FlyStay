import { NavLink } from "react-router-dom";
import { ButtonProps } from "../../types/components/ui/Button";

const Button = ({ title, to, styles }: ButtonProps) => {
  return (
    <NavLink
      className={({ isActive }) =>
        `${styles ? styles : ""} text-center font-medium text-gray-button rounded-4 w-[189px] py-[9px] ${
          isActive ? "bg-primary-500 border-0 text-white font-bold" : ""
        }`
      }
      to={to}
    >
      {title}
    </NavLink>
  );
};

export default Button;
