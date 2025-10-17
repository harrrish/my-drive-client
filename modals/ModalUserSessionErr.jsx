import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModalUserSessionErr() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center shadow-2xl fixed top-0 left-0 z-60">
      <div className="w-[90%] sm:max-w-2xl bg-clr3 p-4 text-clr3 rounded-lg">
        <div className="flex w-full justify-between items-center flex-col text-clr1 font-staat tracking-wider gap-2">
          <h1>Session Expired !</h1>
          <h1>Or</h1>
          <h1>User session not authenticated !</h1>
          <button
            onClick={() => navigate("/login")}
            className="bg-clr7 text-clr1 hover:bg-clr4 font-bebas tracking-widest px-2 w-[45%] cursor-pointer transition-all transition-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
