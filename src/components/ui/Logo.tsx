import { LogoProps } from "../../types/components/NavBar/Logo"

const Logo = ({ url } : LogoProps) => {
  return (
    <div className="mr-4">
      <img src={url} alt="logo" loading="lazy" />
    </div>
  )
}

export default Logo