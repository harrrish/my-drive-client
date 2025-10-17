import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../apis/loginWithGoogle";
import { GoogleLogin } from "@react-oauth/google";

export default function CompGoogleBtn() {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      text="signup_with"
      shape="rectangular"
      theme="filled_blue"
      onSuccess={async (credentialResponse) => {
        // console.log(credentialResponse);
        const res = await loginWithGoogle(credentialResponse.credential);
        if (res === 200 || res === 201) navigate("/");
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      useOneTap
    />
  );
}
