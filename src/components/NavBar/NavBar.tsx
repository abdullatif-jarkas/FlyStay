import { BsQuestionCircle } from "react-icons/bs";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import SearchInput from "../ui/SearchInput";
import LogoImg from "./../../assets/Logo/Logo.png";
import UnitedKingdom from "./../../assets/Navbar/united-kingdom.png";
import { navbarLinks } from "../../data/Navbar";

const NavBar = () => {
  return (
    <nav className="pt-6 pb-10">
      <div className="upper-nav flex justify-between items-center px-layout-padding">
        <Logo url={LogoImg} />
        <div className="info-search-lang flex justify-center items-center grow gap-4">
          <div className="info-lang flex gap-6 items-center">
            <BsQuestionCircle className="text-primary-500 text-xl" />
            <img src={UnitedKingdom} alt="lang" />
          </div>
          <SearchInput />
        </div>
        <div className="nav-buttons flex ml-7 gap-2 items-center">
          <Button title="Sign In" to="/auth/login" styles="border border-primary-500 text-primary-500" />
          <Button title="Register" to="/auth/register" styles="border border-primary-500 text-primary-500" />
        </div>
      </div>
      <div className="lower-nav">
        <div className="nav-links flex justify-center gap-4 mt-10">
          {navbarLinks.map((link, index) => (
            <Button title={link.title} to={link.to} key={index} styles={link.styles} />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
