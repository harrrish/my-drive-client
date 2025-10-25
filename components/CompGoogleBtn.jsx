import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../apis/loginWithGoogle";
import { GoogleLogin } from "@react-oauth/google";
import { UserSettingViewContext } from "../utils/Contexts";
import { useContext } from "react";

export default function CompGoogleBtn() {
  const navigate = useNavigate();
  const { setUserView } = useContext(UserSettingViewContext);

  return (
    <GoogleLogin
      text="signup_with"
      shape="rectangular"
      theme="filled_blue"
      onSuccess={async (credentialResponse) => {
        // console.log(credentialResponse);
        const res = await loginWithGoogle(credentialResponse.credential);
        if (res === 200 || res === 201) {
          navigate("/");
          setUserView(false);
        }
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      useOneTap
    />
  );
}
