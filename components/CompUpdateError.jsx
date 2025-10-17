import { useContext } from "react";
import { ErrorContext, UpdateContext } from "../utils/Contexts";

export default function CompUpdateError() {
  const { error } = useContext(ErrorContext);
  const { update } = useContext(UpdateContext);

  return (
    <div>
      {update && (
        <h1 className="absolute bottom-10 bg-clr5 text-clr1 z-50 right-0 py-2 px-8 font-staat animate-slide tracking-wider">
          {update}
        </h1>
      )}
      {error && (
        <h1 className="absolute bottom-10 bg-red-600 z-50 text-clr1 right-0 py-2 px-8 font-staat animate-slide tracking-wider">
          {error}
        </h1>
      )}
    </div>
  );
}
