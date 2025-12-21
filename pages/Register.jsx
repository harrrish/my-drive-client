import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompRegisterNav from "../components/NavbarRegister";
import CompGoogleBtn from "../components/GoogleBtn";
import CompRegisterToLogin from "../components/FooterRegister";
import { axiosError, axiosWithOutCreds } from "../utils/AxiosInstance";

export default function PageUserRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "alpha",
    email: "alpha@gmail.com",
    password: "1234567890",
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

  const [requestLoad, setRequestLoad] = useState(false);
  const [verifyLoad, setVerifyLoad] = useState(false);
  const [registerLoad, setRegisterLoad] = useState(false);

  const [error, setError] = useState("");
  const [update, setUpdate] = useState("");

  const [timer, setTimer] = useState(null);

  //* ==========> REQUEST OTP
  async function handleRequestOTP() {
    setRequestLoad(true);
    const { email } = formData;
    if (!email.trim()) {
      setError((prev) => [...prev, "Invalid Email"]);
      setTimeout(() => setError((prev) => prev.slice(1)), 3000);
      setRequestLoad(false);
    } else {
      try {
        const res = await axiosWithOutCreds.post("/auth/send-otp", { email });
        if (res.status === 201) {
          const { data } = res;
          console.log(data.message);
          setRequestOTP(true);
          setVerifyOTP(true);
          setRequestLoad(false);
        }
      } catch (error) {
        const msg = "Failed to request OTP";
        axiosError(error, navigate, setError, msg);
        setRequestLoad(false);
      }
    }
  }

  //* ==========> VERIFY OTP
  async function handleVerifyOTP() {
    setVerifyLoad(true);
    const { email, otp } = formData;
    if (!email.trim() || !otp.trim()) {
      setError((prev) => [...prev, "Invalid Email or OTP"]);
      setTimeout(() => setError((prev) => prev.slice(1)), 3000);
      setVerifyLoad(false);
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
          setUpdate((prev) => [...prev, data.message]);
          setTimeout(() => setUpdate((prev) => prev.slice(1)), 3000);
          setVerifyOTP(false);
          setEnableRegister(true);
          setVerifyLoad(false);
        }
      } catch (error) {
        const msg = "Failed to verify OTP";
        axiosError(error, navigate, setError, msg);
        setVerifyLoad(false);
      }
    }
  }

  //* ==========> REGISTER USER
  async function handleRegister() {
    setRegisterLoad(true);
    const { name, email, password, otp } = formData;
    if (!name.trim() || !email.trim() || !password.trim() || !otp.trim()) {
      setEnableRegister(false);
      setError((prev) => [...prev, "Invalid Credentials"]);
      setTimeout(() => setError((prev) => prev.slice(1)), 3000);
      setRegisterLoad(false);
    } else {
      try {
        const { data } = await axiosWithOutCreds.post(
          "/user/register",
          formData,
        );
        console.log(data.message);
        navigate(`/login`);
        setRegisterLoad(false);
      } catch (error) {
        setRequestOTP(false);
        const msg = "Failed to register user";
        axiosError(error, navigate, setError, msg);
        setRegisterLoad(false);
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
    <div className="min-h-[100vh] flex justify-center items-center font-google bg-clrGray">
      <div className="w-[90%] sm:max-w-md mx-auto p-6 shadow-lg flex flex-col gap-2 rounded-sm bg-white">
        {/* //* ==========>NAVBAR */}
        <CompRegisterNav />

        <div className="flex flex-col gap-2 font-medium tracking-wide">
          {/* //* ==========>FULL NAME */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="block">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Harish S"
              className={`w-full px-3 py-2 border-2 shadow-sm focus:outline-blue-400`}
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
              placeholder="harrrish1906@gmail.com"
              onChange={handleChange}
              className={`w-full px-3 py-2 border-2 shadow-sm focus:outline-blue-400`}
            />
            {!requestOTP && (
              <button
                onClick={handleRequestOTP}
                disabled={verifyOTP}
                className=" hover:underline font-google font-medium hover:font-bold cursor-pointer disabled:cursor-not-allowed disabled:hover:decoration-0"
              >
                {requestLoad ? "Requesting OTP..." : "Request OTP"}
              </button>
            )}
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
                    className={`w-full px-3 py-2 border-2 shadow-sm focus:outline-blue-400`}
                  />
                  <div className="flex justify-between w-full">
                    <button
                      onClick={handleVerifyOTP}
                      className=" hover:underline font-google font-medium hover:font-bold cursor-pointer disabled:cursor-not-allowed disabled:hover:decoration-0"
                    >
                      {verifyLoad ? "Verifying OTP..." : "Verify OTP"}
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
              className={`w-full px-3 py-2 border-2 shadow-sm focus:outline-blue-400`}
            />
          </div>

          {/* //* ==========>ERROR */}
          {error && (
            <h1 className="text-center bg-red-600 text-white transform transition-all duration-500">
              {error}
            </h1>
          )}

          {/* //* ==========>UPDATE */}
          {update && (
            <h1 className="text-center bg-green-600 text-white transform transition-all duration-500">
              {update}
            </h1>
          )}

          {/* //* ==========>REGISTER BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleRegister}
              disabled={!enableRegister}
              className={`w-full py-2  px-4 border-2 cursor-pointer shadow-sm focus:outline-blue-400 disabled:cursor-not-allowed disabled:bg-clrGray`}
            >
              {registerLoad ? "Registering User..." : "Register"}
            </button>
          </div>
        </div>

        {/* //* ==========>FOOTER */}
        <div className="flex flex-col gap-2 items-center">
          <CompRegisterToLogin />
          <h1 className="text-center font-medium">Or</h1>
          <CompGoogleBtn />
        </div>
      </div>
    </div>
  );
}
