import { Link } from "react-router-dom";

export default function CompRegisterToLogin() {
  return (
    <p className="font-emb">
      Already have an account?{" "}
      <Link to={"/login"} className=" text-clr4 hover:underline">
        Login
      </Link>
    </p>
  );
}
