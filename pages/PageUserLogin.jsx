import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompLoginNav from "../components/CompLoginNav";
import CompGoogleBtn from "../components/CompGoogleBtn";
import CompLoginToRegister from "../components/CompLoginToRegister";
import { axiosWithCreds } from "../utils/AxiosInstance";
import axios from "axios";
import { UserSettingViewContext } from "../utils/Contexts";

export default function PageUserLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "alpha@gmail.com",
    password: "Qwerty@12345",
  });
  //* ==========>HANDLING FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { setUserView } = useContext(UserSettingViewContext);

  async function handleLogin() {
    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      setError("Invalid Credentials");
      setTimeout(() => setError(""), 3000);
    } else {
      try {
        const { data } = await axiosWithCreds.post("/user/login", formData);
        console.log(data.message);
        setUserView(false);
        navigate("/");
      } catch (error) {
        const errorMsg = axios.isAxiosError(error)
          ? error.response?.data?.error || "User login failed"
          : "Something went wrong";
        if (error.status === 401 && errorMsg === "Expired or Invalid Session")
          navigate("/login");
        else {
          setError(errorMsg);
          setTimeout(() => setError(""), 3000);
        }
      }
    }
  }

  return (
    <div className="bg-gray-200 min-h-[100vh] flex justify-center items-center font-body">
      <div className="w-[90%] sm:max-w-md mx-auto p-6 shadow-lg flex flex-col gap-4 font-bookerly rounded-sm bg-clr1">
        {/* //* ==========>NAVBAR */}
        <CompLoginNav />

        <div className="flex flex-col gap-4 font-emb-display font-bold">
          {/* //* ==========>EMAIL */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="block  ">
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
          {/* //* ==========>PASSWORD */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="block  ">
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

          {/* //* ==========>ERROR */}
          {error && (
            <h1 className="text-center bg-red-500 p-1 text-clr1">{error} !</h1>
          )}

          {/* //* ==========>LOGIN BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleLogin}
              className={`w-full py-2  px-4 border font-emb-display font-bold tracking-wider cursor-pointer shadow-sm bg-clr5 text-clr1 focus:outline-none`}
            >
              Login
            </button>
          </div>
        </div>

        {/* //* ==========>FOOTER */}
        <div className="font-emb flex flex-col gap-2 items-center">
          <CompLoginToRegister />
          <h1 className="text-center">Or</h1>
          <CompGoogleBtn />
        </div>
      </div>
    </div>
  );
}
