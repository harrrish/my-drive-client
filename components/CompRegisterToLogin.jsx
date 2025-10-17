import { Link } from "react-router-dom";

export default function CompRegisterToLogin() {
  return (
    <p className="text-sm">
      Already have an account?{" "}
      <Link
        to={"/login"}
        className=" text-blue-600 hover:text-blue-500 hover:underline  "
      >
        Login
      </Link>
    </p>
  );
}
