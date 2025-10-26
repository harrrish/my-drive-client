import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompRegisterNav from "../components/CompRegisterNav";
import CompGoogleBtn from "../components/CompGoogleBtn";
import CompRegisterToLogin from "../components/CompRegisterToLogin";
import { axiosError, axiosWithOutCreds } from "../utils/AxiosInstance";

export default function PageUserRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Alpha Kumar",
    email: "alpha@gmail.com",
    password: "Qwerty@12345",
    otp: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [requestOTP, setRequestOTP] = useState(false);
  const [verifyOTP, setVerifyOTP] = useState(false);
  const [enableRegister, setEnableRegister] = useState(false);

  const [error, setError] = useState("");
  const [update, setUpdate] = useState("");

  const [timer, setTimer] = useState(null);

  //* ==========> REQUEST OTP
  async function handleRequestOTP() {
    const { email } = formData;
    if (!email.trim()) {
      setError("Invalid Email");
      setTimeout(() => setError(""), 3000);
    } else {
      try {
        const res = await axiosWithOutCreds.post("/auth/send-otp", { email });
        if (res.status === 201) {
          const { data } = res;
          console.log(data.message);
          setRequestOTP(true);
          setVerifyOTP(true);
        }
      } catch (error) {
        const msg = "Failed to request OTP";
        axiosError(error, navigate, setError, msg);
      }
    }
  }

  //* ==========> VERIFY OTP
  async function handleVerifyOTP() {
    const { email, otp } = formData;
    if (!email.trim() || !otp.trim()) {
      setError("Invalid Email or OTP");
      setTimeout(() => setError(""), 3000);
    } else {
      try {
        // console.log(formData.email, formData.otp);
        const res = await axiosWithOutCreds.post("/auth/verify-otp", {
          email,
          otp,
        });
        if (res.status === 200) {
          const { data } = res;
          console.log(data.message);
          setUpdate(data.message);
          setTimeout(() => setUpdate(""), 3000);
          setVerifyOTP(false);
          setEnableRegister(true);
        }
      } catch (error) {
        const msg = "Failed to verify OTP";
        axiosError(error, navigate, setError, msg);
      }
    }
  }

  //* ==========> REGISTER USER
  async function handleRegister() {
    const { name, email, password, otp } = formData;
    if (!name.trim() || !email.trim() || !password.trim() || !otp.trim()) {
      setEnableRegister(false);
      setError("Invalid Credentials");
      setTimeout(() => setError(""), 3000);
    } else {
      try {
        const { data } = await axiosWithOutCreds.post(
          "/user/register",
          formData
        );
        console.log(data.message);
        navigate("/login");
      } catch (error) {
        setRequestOTP(false);
        const msg = "Failed to register user";
        axiosError(error, navigate, setError, msg);
      }
    }
  }

  useEffect(() => {
    if (!verifyOTP) return;
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setVerifyOTP(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [verifyOTP]);

  return (
    <div className="bg-gray-200 min-h-[100vh] flex justify-center items-center font-body">
      <div className="w-[90%] sm:max-w-md mx-auto p-6 shadow-lg flex flex-col gap-4 rounded-sm bg-clr1">
        {/* //* ==========>NAVBAR */}
        <CompRegisterNav />

        <div className="flex flex-col gap-4 font-emb-display font-bold">
          {/* //* ==========>FULL NAME */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="block ">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="User name"
              className={`w-full px-3 py-2 border  shadow-sm focus:outline-blue-400`}
            />
          </div>
          {/* //* ==========>EMAIL */}
          <div className="flex flex-col gap-1 items-start">
            <label htmlFor="email" className="">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              placeholder="Useremail@abc.com"
              onChange={handleChange}
              className={`w-full px-3 py-2 border  shadow-sm focus:outline-blue-400`}
            />
            {!requestOTP && (
              <button
                onClick={handleRequestOTP}
                disabled={verifyOTP}
                className=" hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:decoration-0"
              >
                Request OTP
              </button>
            )}
            {/* //* ==========>Request OTP */}
            {verifyOTP && (
              <div className="w-full">
                <div>
                  <input
                    type="otp"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="****"
                    className={`w-full px-3 py-2 border  shadow-sm focus:outline-blue-400`}
                  />
                  {/* //* ==========>VERIFY OTP */}
                  <div className="flex justify-between w-full">
                    <button
                      onClick={handleVerifyOTP}
                      className=" hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed "
                    >
                      Verify OTP
                    </button>
                    <span>(OTP is valid for {timer} seconds)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* //* ==========>PASSWORD */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="block ">
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
          {/* //* ==========>UPDATE */}
          {update && (
            <h1 className="text-center bg-green-500 p-1 text-clr1">
              {update} !
            </h1>
          )}

          {/* //* ==========>REGISTER BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleRegister}
              disabled={!enableRegister}
              className={`w-full py-2  px-4 border font-emb-display font-bold tracking-wider cursor-pointer shadow-sm bg-clr5 text-clr1 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              Register
            </button>
          </div>
        </div>

        {/* //* ==========>FOOTER */}
        <div className="font-emb flex flex-col gap-2 items-center">
          <CompRegisterToLogin />
          <h1 className="text-center">Or</h1>
          <CompGoogleBtn />
        </div>
      </div>
    </div>
  );
}
