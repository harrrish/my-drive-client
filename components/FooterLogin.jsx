import { Link } from "react-router-dom";

export default function CompLoginToRegister() {
  return (
    <p className="font-google font-medium">
      Do not have an account?{" "}
      <Link to={"/register"} className="  hover:underline ">
        Sign up
      </Link>
    </p>
  );
}
