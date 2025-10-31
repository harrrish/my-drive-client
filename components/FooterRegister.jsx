import { Link } from "react-router-dom";

export default function CompRegisterToLogin() {
  return (
    <p className="font-google font-medium">
      Already have an account?{" "}
      <Link to={"/login"} className="hover:underline hover:text-clrLightBlue">
        Login
      </Link>
    </p>
  );
}
