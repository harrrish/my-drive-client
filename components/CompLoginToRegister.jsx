import { Link } from "react-router-dom";

export default function CompLoginToRegister() {
  return (
    <p className="font-emb">
      Do not have an account?{" "}
      <Link to={"/register"} className=" text-clr4 hover:underline">
        Sign up
      </Link>
    </p>
  );
}
