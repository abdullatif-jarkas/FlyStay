import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt_token"); 
    console.log("token: ", token)
    const roles = localStorage.getItem("roles"); // أو من API لاحقًا

    if (token) {
      localStorage.setItem("token", token);
      if (roles) localStorage.setItem("roles", roles);
      navigate("/"); // أو أي صفحة بعد الدخول
    } else {
      console.warn("لم يتم العثور على التوكن في الكوكي");
      navigate("/login"); // fallback لو ما فيش توكن
    }
  }, [navigate]);

  return <p>Loading...</p>;
}
