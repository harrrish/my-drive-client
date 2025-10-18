import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { userLoginSubmit } from "../utils/UserQueryFunctions";
import CompLoginNav from "../components/CompLoginNav";
import CompError from "../components/CompError";
import CompGoogleBtn from "../components/CompGoogleBtn";
import CompLoginToRegister from "../components/CompLoginToRegister";

export default function PageUserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "alpha@gmail.com",
    password: "Qwerty@12345",
  });

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: userLoginSubmit,
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: (data) => {
      navigate("/root");
      console.log(data);
    },
  });

  useEffect(() => {
    setTimeout(() => {
      reset();
    }, 3000);
  }, [error, reset]);

  //* HANDLING FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="bg-gray-200 min-h-[100vh] flex justify-center items-center font-body">
      <div className="w-[90%] sm:max-w-md mx-auto p-6 shadow-lg flex flex-col gap-2 font-f1 rounded-sm bg-clr1">
        <CompLoginNav />

        <div className="flex flex-col gap-2 font-lex tracking-wide">
          {/* //* EMAIL */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="block text-sm ">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Useremail@abc.com"
              className={`w-full px-3 py-2 border  shadow-sm focus:outline-blue-400`}
            />
          </div>
          {/* //* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="block text-sm ">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              placeholder="********"
              onChange={handleChange}
              className={`w-full px-3 py-2 border  shadow-sm focus:outline-blue-400`}
            />
          </div>
          {/* //* LOGIN BUTTON */}
          <div>
            <button
              type="button"
              onClick={() => mutate(formData)}
              className={`w-full py-2 text-lg px-4 border-2 font-bebas tracking-wider text-clr1 shadow-sm  bg-clr5 hover:border-2 cursor-pointer hover:text-clr1`}
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>

        {error && <CompError error={error.message} />}

        <div className="flex flex-col items-center">
          <CompLoginToRegister />
          <h1 className="text-center">Or</h1>
          <CompGoogleBtn />
        </div>
      </div>
    </div>
  );
}
