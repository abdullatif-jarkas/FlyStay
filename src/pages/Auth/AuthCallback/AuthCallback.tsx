import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token); // أو خزنه في Redux/Context
    }
    navigate("/");
  }, [token, navigate]);
}
