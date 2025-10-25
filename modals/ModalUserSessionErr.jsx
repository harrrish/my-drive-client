import { useNavigate } from "react-router-dom";

export default function ModalUserSessionErr() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center bg-black/80 shadow-2xl fixed top-0 left-0 z-60">
      <div className="w-[90%] sm:max-w-2xl bg-gray-100 text-red-600 p-4 rounded-sm">
        <div className="flex w-full justify-between items-center flex-col gap-2 font-bookerly-display font-extrabold tracking-wide">
          <h1>Session Expired !</h1>
          <h1>Or</h1>
          <h1>User session not authenticated !</h1>
          <button
            onClick={() => navigate("/login")}
            className="hover:bg-clr7 text-clr7 border-2 hover:text-clr1 rounded-sm shadow-md hover:shadow-2xl font-emb font-bold px-2 w-[45%] cursor-pointer transition-all transition-300"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
