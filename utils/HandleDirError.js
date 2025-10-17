import { dirErr, errorSession } from "./CustomReturns";

export function handleErrResp(
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
  } else if (status === 404 && message === dirErr) {
    setError(`${message}, Redirecting to Home !`);
    navigate("/root");
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
