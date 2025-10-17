import { errorSession, fileErr } from "./CustomReturns";

export function handleFileErrResp(
  status,
  message,
  setError,
  setErrorModal,
  navigate,
  setUpdate
) {
  setUpdate("");
  //* ERROR 401
  if (status === 401 && message === errorSession) {
    setErrorModal(true);
    //* ERROR 400
  } else if (status === 400 && message === fileErr) {
    navigate("/root");
    setError(`${message}, Redirected to Home !`);
    console.log(message);
    setTimeout(() => {
      setError("");
    }, 3000);
    //* ERROR 500
  } else {
    setError(message);
    console.log(message);
    setTimeout(() => {
      setError("");
    }, 3000);
  }
}
