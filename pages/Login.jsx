import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompLoginNav from "../components/NavbarLogin";
import CompGoogleBtn from "../components/GoogleBtn";
import CompLoginToRegister from "../components/FooterLogin";
import { axiosError, axiosWithCreds } from "../utils/AxiosInstance";
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
        navigate("/directory");
      } catch (error) {
        const msg = "Failed to login user";
        axiosError(error, navigate, setError, msg);
      }
    }
  }

  return (
    <div className="min-h-[100vh] flex justify-center items-center font-google bg-clrGray">
      <div className="w-[90%] sm:max-w-md mx-auto p-6 shadow-2xl flex flex-col gap-4 rounded-sm bg-white">
        {/* //* ==========>NAVBAR */}
        <CompLoginNav />

        <div className="flex flex-col gap-4 font-medium tracking-wide">
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
              className={`w-full px-3 py-2 border-2 shadow-sm focus:outline-blue-400`}
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
              className={`w-full px-3 py-2 border-2 shadow-sm focus:outline-blue-400`}
            />
          </div>

          {/* //* ==========>ERROR */}
          {error && (
            <h1 className="text-center p-1 text-clrWhite bg-clrRed tracking-wider">
              {error} !
            </h1>
          )}

          {/* //* ==========>LOGIN BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleLogin}
              className={`w-full py-2  px-4 border-2 cursor-pointer shadow-sm focus:outline-none`}
            >
              Login
            </button>
          </div>
        </div>

        {/* //* ==========>FOOTER */}
        <div className=" flex flex-col gap-1 items-center">
          <CompLoginToRegister />
          <h1 className="text-center font-bold text-sm">Or</h1>
          <CompGoogleBtn />
        </div>
      </div>
    </div>
  );
}
